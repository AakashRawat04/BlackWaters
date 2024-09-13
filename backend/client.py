import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.datasets import mnist
import numpy as np
import asyncio
import socketio

# Check for GPU availability
gpus = tf.config.list_physical_devices('GPU')
if gpus:
    print(f"GPUs detected: {gpus}")
else:
    print("No GPU detected. Using CPU.")

# Load and preprocess data
(x_train, y_train), (x_test, y_test) = mnist.load_data()
x_train, x_test = x_train / 255.0, x_test / 255.0
x_train = np.expand_dims(x_train, -1)
x_test = np.expand_dims(x_test, -1)
y_train = tf.keras.utils.to_categorical(y_train, 10)
y_test = tf.keras.utils.to_categorical(y_test, 10)

# Build model
model = models.Sequential([
    layers.Conv2D(32, kernel_size=(3, 3), activation='relu', input_shape=(28, 28, 1)),
    layers.MaxPooling2D(pool_size=(2, 2)),
    layers.Flatten(),
    layers.Dense(128, activation='relu'),
    layers.Dense(10, activation='softmax')
])

loss_fn = tf.keras.losses.CategoricalCrossentropy()
optimizer = tf.keras.optimizers.Adam()
train_acc_metric = tf.keras.metrics.CategoricalAccuracy()
test_acc_metric = tf.keras.metrics.CategoricalAccuracy()

# Forward pass for the training step
def forward_pass(model, inputs, targets):
    with tf.GradientTape() as tape:
        predictions = model(inputs, training=True)
        loss_value = loss_fn(targets, predictions)
    return loss_value, predictions, tape

# Training step
def train_step(inputs, targets):
    loss_value, predictions, tape = forward_pass(model, inputs, targets)
    grads = tape.gradient(loss_value, model.trainable_weights)
    optimizer.apply_gradients(zip(grads, model.trainable_weights))
    train_acc_metric.update_state(targets, predictions)
    return loss_value, grads

# Testing step
def test_step(inputs, targets):
    predictions = model(inputs, training=False)
    loss_value = loss_fn(targets, predictions)
    test_acc_metric.update_state(targets, predictions)
    return loss_value

# Function to log training data
def training_log(epoch, step, loss_value, gradients, train_acc, test_acc=None) -> dict:
    log_data = {
        "epoch": epoch,
        "step": step,
        "loss": float(loss_value),
        "gradients": [float(g.numpy().sum()) for g in gradients],
        "train_accuracy": float(train_acc),
    }
    if test_acc is not None:
        log_data["test_accuracy"] = float(test_acc)
    return log_data

# Create an async Socket.IO client
sio = socketio.AsyncClient()

@sio.event
async def connect():
    print('Connected to the server!')

@sio.event
async def disconnect():
    print('Disconnected from the server!')

# Function to send training data to the server
async def send_training_data(log_data):
    try:
        await sio.emit('training_data', log_data)
    except Exception as e:
        print(f"Error sending data: {e}")

# Asynchronous model training function with Socket.IO integration
async def train_model(epochs, batch_size):
    for epoch in range(epochs):
        print(f"Epoch {epoch + 1}/{epochs}")

        # Shuffle the training data
        indices = np.arange(x_train.shape[0])
        np.random.shuffle(indices)
        x_train_shuffled = x_train[indices]
        y_train_shuffled = y_train[indices]

        # Training loop
        for i in range(0, x_train.shape[0], batch_size):
            x_batch = x_train_shuffled[i:i + batch_size]
            y_batch = y_train_shuffled[i:i + batch_size]

            # Perform a single training step
            loss_value, grads = train_step(x_batch, y_batch)
            train_acc = train_acc_metric.result().numpy()

            # Log training data and send to Socket.IO server
            log_data = training_log(epoch + 1, i // batch_size, loss_value, grads, train_acc)
            
            # Send the data immediately after each step
            await send_training_data(log_data)

            if i % (batch_size * 10) == 0:
                print(f"Step {i // batch_size}, Loss: {loss_value.numpy()}, Gradients: {[g.numpy().sum() for g in grads]}")

        # Display training accuracy
        train_acc = train_acc_metric.result().numpy()
        print(f"Training accuracy: {train_acc * 100:.2f}%")

        # Reset training metrics
        train_acc_metric.reset_states()

        # Testing loop
        for i in range(0, x_test.shape[0], batch_size):
            x_batch = x_test[i:i + batch_size]
            y_batch = y_test[i:i + batch_size]
            test_step(x_batch, y_batch)

        # Display and log test accuracy
        test_acc = test_acc_metric.result().numpy()
        print(f"Test accuracy: {test_acc * 100:.2f}%")

        # Log test accuracy and send to Socket.IO server
        log_data = training_log(epoch + 1, "test", None, None, train_acc, test_acc)
        await send_training_data(log_data)

        # Reset test metrics
        test_acc_metric.reset_states()

# Separate the Socket.IO connection and training tasks
async def main():
    await sio.connect('http://127.0.0.1:5000')
    
    # Start the training model in a separate asyncio task
    training_task = asyncio.create_task(train_model(epochs=5, batch_size=64))
    
    # Keep the connection open while training runs
    await sio.wait()

if __name__ == "__main__":
    asyncio.run(main())
