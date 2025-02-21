import { useState } from "react";
import { Form, Container, Row, Col, Button, Alert } from "react-bootstrap";
import dynamic from "next/dynamic";
import { CopyToClipboard } from "react-copy-to-clipboard";

const ReactJson = dynamic(() => import("react-json-view"), { ssr: false });

const Home = () => {
  const [line, setLine] = useState("");
  const [column, setColumn] = useState("");
  const [sourceMap, setSourceMap] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState({ android: false, ios: false });
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const androidCommand =
    "react-native bundle --platform android --dev false --entry-file index.js --bundle-output ./android/app/src/main/assets/index.android.bundle --sourcemap-output ./android/app/src/main/assets/index.android.bundle.map";
  const iosCommand =
    "react-native bundle --platform ios --dev false --entry-file index.js --bundle-output ./ios/main.jsbundle --sourcemap-output ./ios/main.jsbundle.map";

  const handleCopy = (platform) => {
    setCopied({ ...copied, [platform]: true });
    setTimeout(() => {
      setCopied({ ...copied, [platform]: false });
    }, 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!sourceMap || !line || !column) {
      setError("Please fill in all fields and upload a source map file");
      return;
    }

    const formData = new FormData();
    formData.append("sourceMap", sourceMap);
    formData.append("line", line);
    formData.append("column", column);

    try {
      setIsLoading(true);
      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setResult(data);
      setError(null);
      setAnalysisResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="py-5" style={{ maxWidth: "1200px" }}>
      <div className="text-center mb-5">
        <h1 className="display-4 mb-3">React Native Source Map Analyzer</h1>
        <p className="lead text-muted">
          Easily locate errors in your React Native application's source code
        </p>
      </div>

      <Row className="mb-4">
        <Col lg={12}>
          <div className="p-4 bg-light rounded shadow-sm">
            <h4 className="border-bottom pb-3 mb-4">Generate Source Map Commands</h4>
            <Row>
              <Col md={6}>
                <h5>For Android:</h5>
                <div className="position-relative">
                  <pre
                    className="bg-dark text-light p-3 rounded shadow-sm"
                    style={{ fontSize: "0.9rem" }}
                  >
                    {androidCommand}
                  </pre>
                  <CopyToClipboard
                    text={androidCommand}
                    onCopy={() => handleCopy("android")}
                  >
                    <Button
                      variant="light"
                      size="sm"
                      className="position-absolute top-0 end-0 m-2 shadow-sm"
                    >
                      {copied.android ? "Copied!" : "Copy"}
                    </Button>
                  </CopyToClipboard>
                </div>
              </Col>

              <Col md={6}>
                <h5 className="mt-3 mt-md-0">For iOS:</h5>
                <div className="position-relative">
                  <pre
                    className="bg-dark text-light p-3 rounded shadow-sm"
                    style={{ fontSize: "0.9rem" }}
                  >
                    {iosCommand}
                  </pre>
                  <CopyToClipboard
                    text={iosCommand}
                    onCopy={() => handleCopy("ios")}
                  >
                    <Button
                      variant="light"
                      size="sm"
                      className="position-absolute top-0 end-0 m-2 shadow-sm"
                    >
                      {copied.ios ? "Copied!" : "Copy"}
                    </Button>
                  </CopyToClipboard>
                </div>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>

      <div className="bg-white p-4 rounded shadow-sm mb-4">
        <h4 className="border-bottom pb-3 mb-4">Error Analysis</h4>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Line Number</Form.Label>
                <Form.Control
                  type="number"
                  value={line}
                  onChange={(e) => setLine(e.target.value)}
                  placeholder="Ex: 750"
                  className="shadow-sm"
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Column Number</Form.Label>
                <Form.Control
                  type="number"
                  value={column}
                  onChange={(e) => setColumn(e.target.value)}
                  placeholder="Ex: 4271"
                  className="shadow-sm"
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-4">
            <Form.Label>Source Map File</Form.Label>
            <Form.Control
              type="file"
              onChange={(e) => setSourceMap(e.target.files?.[0] || null)}
              accept=".map"
              className="shadow-sm"
            />
          </Form.Group>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-100 shadow-sm"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="loading-spinner">
                <span>Analyzing...</span>
              </div>
            ) : (
              'Analyze'
            )}
          </Button>
        </Form>
      </div>

      {error && (
        <Alert variant="danger" className="mt-3 shadow-sm">
          {error === "Please fill in all fields and upload a source map file" 
            ? error 
            : "An error occurred during analysis"}
        </Alert>
      )}

      {analysisResult && !isLoading && (
        <div className="mt-4 bg-white p-4 rounded shadow-sm">
          <h4 className="border-bottom pb-3 mb-4">Analysis Result</h4>
          <div className="bg-dark p-3 rounded shadow-sm">
            <ReactJson
              src={analysisResult}
              theme="monokai"
              displayDataTypes={false}
              name={false}
              style={{
                backgroundColor: "transparent",
                fontSize: "1rem",
                borderRadius: "0.375rem",
              }}
            />
          </div>
        </div>
      )}

      <style jsx>{`
        .loading-spinner {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .loading-spinner::before {
          content: '';
          width: 16px;
          height: 16px;
          border: 2px solid #f3f3f3;
          border-top: 2px solid #3498db;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .analyze-button {
          padding: 10px 20px;
          background-color: #3498db;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .analyze-button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }
      `}</style>
    </Container>
  );
};

export default Home;
