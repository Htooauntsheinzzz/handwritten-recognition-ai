/**
 * Handwritten Digit Recognition - Enhanced React Frontend with Image Upload
 * Author: Htoo Aunt
 * Description: Interactive whiteboard + Image upload for digit recognition
 */

import React, { useState, useRef, useEffect, useCallback } from "react";
import './App.css';
import TeamMembers from './TeamMembers';
import Shuffle from "./animate/Shuffle";
import TextType from "./animate/TextType";
import TargetCursor from "./animate/TargetCursor";


function App() {
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState('checking');
  const [autoPredict, setAutoPredict] = useState(false);
  const [strokeCount, setStrokeCount] = useState(0);
  const [mode, setMode] = useState('draw');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [currentPage, setCurrentPage] = useState('app');


  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    checkAPIHealth();
  },);

  const checkAPIHealth = async () => {
    try {
      const response = await fetch(`${API_URL}/health`)
      const data = await response.json();

      if (data.status === 'healthy' && data.model_loaded) {
        setApiStatus('connected');
      } else {
        setApiStatus('model-not-loaded');
      }
    } catch (error) {
      setApiStatus('disconnected');
      console.error('API  connection failed', error);
    }
  };

  // Initialize canvas with whiteboard style

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 20;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }
  }, []);

  const predictDigit = useCallback(async () => {
    if (apiStatus !== 'connected') {
      alert('Backend API is not connected . Please start the flask server.');
      return;
    }
    setLoading(true);

    try {
      const canvas = canvasRef.current;
      const imageData = canvas.toDataURL('image/png');

      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageData }),
      });

      const data = await response.json();
      if (data.success) {
        setPrediction(data);
      } else {
        alert('Prediction Failed: ' + data.error);
      }
    } catch (error) {
      console.error('Error: ' + error);
      alert('Failed To connect to backend.make sure Flask server is running.');
    }
    setLoading(false);
  }, [apiStatus, API_URL]);

  useEffect(() => {
    if (autoPredict && strokeCount > 0 && mode === 'draw') {
      const timer = setTimeout(() => {
        predictDigit();
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [strokeCount, autoPredict, mode, predictDigit]);

  const startDrawing = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();

    ctx.beginPath();
    ctx.moveTo(
      e.clientX - rect.left,
      e.clientY - rect.top
    );
  };

  const draw = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();

    ctx.lineTo(
      e.clientX - rect.left,
      e.clientY - rect.top
    );

    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      setStrokeCount(prev => prev + 1);
    }
  };

  const handleTouchStart = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    setIsDrawing(true);
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(
      touch.clientX - rect.left,
      touch.clientY - rect.top
    );
  };


  const handleTouchMove = (e) => {
    if (!isDrawing) return;
    e.preventDefault();

    const touch = e.touches[0];
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();

    ctx.lineTo(
      touch.clientX - rect.left,
      touch.clientY - rect.top

    );
    ctx.stroke();

  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
    if (isDrawing) {
      setIsDrawing(false);
      setStrokeCount(prev => prev + 1);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setPrediction(null);
    setStrokeCount(0);
    setUploadedImage(null);
  };


  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG,JPG,etc.)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const scale = Math.min(
          canvas.width / img.width,
          canvas.height / img.height
        );

        const x = (canvas.width - img.width * scale) / 2;
        const y = (canvas.height - img.height * scale) / 2;

        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        setUploadedImage(event.target.result);

        if (autoPredict) {
          setTimeout(() => predictDigit(), 500);
        }
      };

      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const triggerFileUpload = () => {
    fileInputRef.current.click();
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    clearCanvas();
  };

  // Render Team Members page
  if (currentPage === 'team') {
    return (
      <div className="App">
        <nav className="main-nav">
          <button
            className="nav-btn cursor-target"
            onClick={() => setCurrentPage('app')}
          >
            ← Back to App
          </button>
        </nav>
        <TeamMembers />
      </div>
    );
  }

  return (
    <div className="App">
      <nav className="main-nav">
        <button
          className="nav-btn team-nav-btn cursor-target"
          onClick={() => setCurrentPage('team')}
        >
          Team Members
        </button>
      </nav>
      <header className="app-header">
        {/* <h1> ✍️ AI Hand Written Digit Recognition </h1> */}
        <Shuffle
          text="AI Hand-Written Digit Recognition"
          shuffleDirection="right"
          duration={4.0}
          animationMode="evenodd"
          shuffleTimes={1}
          ease="power3.out"
          stagger={0.03}
          threshold={0.1}
          triggerOnce={true}
          triggerOnHover={true}
          respectReducedMotion={true}
        />
        <p>
          <TextType
            text={["Draw a digit or upload an image", "let AI recognize it!"]}
            typingSpeed={75}
            pauseDuration={1500}
            showCursor={true}
            cursorCharacter="|"
          />
        </p>
        <div className={`api-status ${apiStatus}`}>
          {apiStatus === 'connected' && '✓ AI Model Connected'}
          {apiStatus === 'disconnected' && 'x Backend Disconnected'}
          {apiStatus === 'model-not-loaded' && '⚠ Model Not Loaded'}
          {apiStatus === 'checking' && '⏳ Checking...'}
        </div>
      </header>
      <div className="mode-selector">
        <TargetCursor
          spinDuration={2}
          hideDefaultCursor={true}
          parallaxOn={true}
        />
        <button className={`cursor-target mode-btn ${mode === 'draw' ? 'active' : ''}`}
          onClick={() => switchMode('draw')}
        >
          Draw Digit
        </button>

        <button className={`cursor-target mode-btn  ${mode === 'upload' ? 'active' : ''}`}
          onClick={() => switchMode('upload')}
        >
          Upload Image
        </button>
      </div>
      {/* Main Content */}

      <div className="whiteboard-container">
        <div className="whiteboard-section">
          <div className="whiteboard-header">
            <h2>
              {mode === 'draw' ? 'Draw Your Digit Here' : 'upload Digit Image'}
            </h2>
            {mode === 'draw' && (
              <div className="whiteboard-controls">
                <label className="auto-predict-toogle">
                  <input type="checkbox"
                    checked={autoPredict}
                    onChange={(e) => setAutoPredict(e.target.checked)}
                  />
                  <span>Auto-Predict</span>
                </label>
              </div>
            )}
          </div>
          <div className="whiteboard-wrapper">
            <canvas
              ref={canvasRef}
              width={400}
              height={400}
              className="whiteboard-canvas"
              onMouseDown={mode === 'draw' ? startDrawing : undefined}
              onMouseMove={mode === 'draw' ? draw : undefined}
              onMouseUp={mode === 'draw' ? stopDrawing : undefined}
              onMouseLeave={mode === 'draw' ? stopDrawing : undefined}
              onTouchStart={mode === 'draw' ? handleTouchStart : undefined}
              onTouchMove={mode === 'draw' ? handleTouchMove : undefined}
              onTouchEnd={mode === 'draw' ? handleTouchEnd : undefined}
              style={{ cursor: mode === 'draw' ? 'crosshair' : 'default' }}
            />
            {!prediction && strokeCount === 0 && !uploadedImage && (
              <div className="canvas-hint">
                <span className="hint-icon">
                  {mode === 'draw' ? '✍️' : '📁'}
                </span>
                <p>{mode === 'draw' ? 'Draw a digit here' : 'Click upload to add image'}</p>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
          />
          <div className="whiteboard-buttons">
            {mode === 'upload' && (
              <button className="btn btn-upload"
                onClick={triggerFileUpload}
              >
                Choose Image File
              </button>
            )}
            <button className="btn btn-predict cursor-target"
              onClick={predictDigit}
              disabled={loading || apiStatus !== 'connected' || (mode === 'draw' && strokeCount === 0 && !uploadedImage)}
            >
              {loading ? (
                <> 🔄Recognizing...</>
              ) : (
                <>Recognize Digit</>
              )}
            </button>
            <button className="btn btn-clear cursor-target"
              onClick={clearCanvas}
            >
              Clear
            </button>
          </div>

          {/* Current Mode Info */}
          <div className="mode-info">
            {mode === 'draw' && (
              <p>💡 Use your mouse or finger to draw a digit</p>
            )}
            {mode === 'upload' && (
              <p>💡 Upload any image  containing a Handwritten Digit</p>
            )}
          </div>
        </div>
        {/* Recognition Results */}
        <div className="recognition-panel">
          <h2>🤖 AI Digit Recognition Results</h2>
          {!prediction && (
            <div className="empty-recognition">
              <div className="empty-icon">🎯</div>
              <p>Waiting for your digit...</p>
              <small>
                {mode === 'draw'
                  ? 'Draw on the whiteboard and click "Recognize"'
                  : 'Upload an image and click "Recognize"'}
              </small>
            </div>
          )}

          {prediction && prediction.success && (
            <div className="recognition-results">
              {/* Main Recognized Digit */}
              <div className="recognized-digit-display">
                <div className="digit-label">Recognized Digit:</div>
                <div className="giant-label">{prediction.digit}</div>

                <div className="confidence-badge">
                  <span className="confidence-label">Confidence:</span>
                  <span className="confidence-value">{prediction.confidence.toFixed(1)} %</span>
                </div>
                {mode === 'upload' && (
                  <div className="source-badge">📂 From Uploaded Image</div>
                )}
                {mode === 'draw' && (
                  <div className="source-badge">✍️ From Whiteboard Drawing</div>
                )}
              </div>
              {/* Visual Confidence Meter */}
              <div className="confidence-meter">
                <div className="meter-label">AI Certainty Level</div>
                <div className="meter-bar-container">
                  <div className={`meter-bar ${prediction.confidence >= 90 ? 'high' :
                    prediction.confidence > 70 ? 'medium' : 'low'
                    }`}
                    style={{ width: `${prediction.confidence}%` }}
                  >
                    <span className="meter-text">{prediction.confidence.toFixed(1)}%</span>
                  </div>
                </div>
                <div className="meter-scale">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>
              <div className="all-probabilites">
                <h3>📊 Probability Distribution</h3>
                <div className="probability-list">
                  {Object.entries(prediction.all_probabilities)
                    .sort((a, b) => b[1] - a[1])
                    .map(([digit, prob]) => (
                      <div
                        key={digit}
                        className={`probability-row ${digit === String(prediction.digit) ? 'top-prediction' : ''}`}
                      >
                        <div className="prob-digit">{digit}</div>
                        <div className="prob-bar-wrapper">
                          <div className={`prob-bar ${digit === String(prediction.digit) ? 'primary' : 'secondary'}`}
                            style={{
                              width: `${prob}%`,
                              transition: 'width 0.8s ease-out'
                            }}
                          >
                            {prob > 5 && (
                              <span className="prob-bar-label">{prob.toFixed(1)}%</span>
                            )}
                          </div>
                        </div>
                        <div className="prob-percentage">{prob.toFixed(1)}%</div>
                      </div>
                    ))}
                </div>
              </div>
              <div className="ai-insights">
                <h4>AI insights</h4>
                <div className="insight-tags">
                  {prediction.confidence >= 95 && (
                    <span className="tag tag-excellent">Excellent Recognition</span>
                  )}
                  {prediction.confidence >= 85 && prediction.confidence < 95 && (
                    <span className="tag tag-good">Good Recognition</span>
                  )}
                  {prediction.confidence < 85 && (
                    <span className="tag tag-certain">Uncertain - Try again</span>
                  )}

                  {(() => {
                    const sorted = Object.entries(prediction.all_probabilities)
                      .sort((a, b) => b[1] - a[1]);
                    const secondBest = sorted[1];
                    if (secondBest && secondBest[1] > 10) {
                      return (
                        <span className="tag tag-altenative">
                          Could also be: {secondBest[0]} ({secondBest[1].toFixed(1)}%)
                        </span>
                      );
                    }
                  })()}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Instructions */}
      <div className="instructions-panel">
        <h3>📖 How to Use Our AI</h3>
        <div className="instruction-grid">
          <div className="instruction-item">
            <div className="instruction-number">1</div>
            <div className="instruction-text">
              <strong>Choose Mode</strong>
              <p>Select "Draw Digit" or "Upload Image"</p>
            </div>
          </div>
          <div className="instruction-item">
            <div className="instruction-number">2</div>
            <div className="instruction-text">
              <strong>Input Digit</strong>
              <p>Draw with mouse/finger OR upload an image</p>
            </div>
          </div>
          <div className="instruction-item">
            <div className="instruction-number">3</div>
            <div className="instruction-text">
              <strong>Recognize</strong>
              <p>DClick "Recognize Digit" to get AI prediction</p>
            </div>
          </div>
          <div className="instruction-item">
            <div className="instruction-number">4</div>
            <div className="instruction-text">
              <strong>View Results</strong>
              <p>See prediction with confidence and probabilities</p>
            </div>
          </div>
        </div>
      </div>
      <div className="tips-section">
        <h3>💡 Tips for Best Results</h3>
        <div className="tips-grid">
          <div className="tips-column">
            <h4>✍️ Drawing Tips:</h4>
            <ul className="tips-list">
              <li>✓ Draw digits large and centered</li>
              <li>✓ Use bold, clear strokes</li>
              <li>✓ Avoid drawing too thin or small</li>
              <li>✓ Enable Auto-Predict for instant recognition</li>
            </ul>
          </div>
          <div className="tips-column">
            <h4>📸 Image Upload Tips:</h4>
            <ul className="tips-list">
              <li>✓ Use high-contrast images (dark digit on light background)</li>
              <li>✓ Ensure the digit is clearly visible and not blurry</li>
              <li>✓ Crop images to focus on the digit</li>
              <li>✓ Supported formats: PNG, JPG, JPEG, BMP</li>
            </ul>
          </div>
        </div>
      </div>
      <footer className="app-footer">
        <div className="footer-content">
          <p><strong>Hand-written Digit Recognition AI</strong></p>
          <p>Created by Big Daddies | AI Project Project 2024</p>
          <p>Powered by TensorFlow CNN & React</p>
        </div>
      </footer>
    </div>
  );
}

export default App;