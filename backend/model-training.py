import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.datasets import mnist
import numpy as np
from fastapi import WebSocket

gpus = tf.config.list_physical_devices('GPU')
if gpus:
    print(f"GPUs detected: {gpus}")
else:
    print("No GPU detected. Using CPU.")

(x_train, y_train), (x_test, y_test) = mnist.load_data()
x_train, x_test = x_train / 255.0, x_test / 255.0

x_train = np.expand_dims(x_train, -1)
x_test = np.expand_dims(x_test, -1)

y_train = tf.keras.utils.to_categorical(y_train, 10)
y_test = tf.keras.utils.to_categorical(y_test, 10)

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

def forward_pass(model, inputs, targets):
    with tf.GradientTape() as tape:
        predictions = model(inputs, training=True)
        loss_value = loss_fn(targets, predictions)
    return loss_value, predictions, tape

def train_step(inputs, targets):
    loss_value, predictions, tape = forward_pass(model, inputs, targets)
    
    grads = tape.gradient(loss_value, model.trainable_weights)
    
    optimizer.apply_gradients(zip(grads, model.trainable_weights))
    
    train_acc_metric.update_state(targets, predictions)
    
    return loss_value, grads

def test_step(inputs, targets):
    predictions = model(inputs, training=False)
    loss_value = loss_fn(targets, predictions)
    
    test_acc_metric.update_state(targets, predictions)
    
    return loss_value

import asyncio
import websockets
import json

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

# Modify train_model to send training data via WebSocket
async def train_model(epochs, batch_size, websocket_url):
    async with websockets.connect(websocket_url) as websocket:
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
                
                # Calculate current training accuracy
                train_acc = train_acc_metric.result().numpy()
                
                # Send training log to the WebSocket server
                log_data = training_log(epoch + 1, i // batch_size, loss_value, grads, train_acc)
                await websocket.send(json.dumps(log_data))
                
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
                
                # Perform a single test step
                test_step(x_batch, y_batch)
            
            # Display and log test accuracy
            test_acc = test_acc_metric.result().numpy()
            print(f"Test accuracy: {test_acc * 100:.2f}%")
            
            # Send test accuracy log to the WebSocket server
            log_data = training_log(epoch + 1, "test", None, None, train_acc, test_acc)
            await websocket.send(json.dumps(log_data))
            
            test_acc_metric.reset_states()

if __name__ == "__main__":
    websocket_url = "ws://0.0.0.0:3000/ws2"  # Your WebSocket URL
    asyncio.get_event_loop().run_until_complete(train_model(epochs=5, batch_size=64, websocket_url=websocket_url))
    
    
    
#     @app.websocket("/ws2")
# async def websocket_training(websocket: WebSocket):
#     await websocket.accept()
#     try:
#         while True:
#             # Wait to receive the training data (sent by the training process)
#             data = await websocket.receive_json()

#             # Log or print the data (optional for debugging)
#             print(f"Received training data: {data}")

#             # Send the training data to the connected clients (frontend)
#             await websocket.send_json(data)

#             # Sleep or wait between sending updates (if required)
#             await asyncio.sleep(1)

#     except Exception as e:
#         print(f"Connection closed: {e}")
#     finally:
#         await websocket.close()
