import React, { useState } from "react";
import {
  Layout,
  Typography,
  Form,
  Input,
  Button,
  Alert,
  List,
  Divider,
} from "antd";

const { Title, Paragraph, Text } = Typography;
const { Content } = Layout;

function App() {
  const [targetAmount, setTargetAmount] = useState("");
  const [denominations, setDenominations] = useState("0.01,0.5,1,5,10");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [denomError, setDenomError] = useState(false); // Flag for invalid denomination input

  const handleSubmit = async () => {
    setError(null);
    setResult(null);
    setLoading(true);

    // Set of allowed coin denominations
    const allowedCoins = new Set([
      0.01, 0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10, 50, 100, 1000,
    ]);

    // Parse and clean user input
    const rawInput = denominations
      .split(",")
      .map((s) => parseFloat(s.trim()))
      .filter((n) => !isNaN(n));

    // Check if all denominations are valid
    const allValid = rawInput.length > 0 && rawInput.every((n) => allowedCoins.has(n));
    setDenomError(!allValid);

    // Only keep valid coins for processing
    const coins = rawInput.filter((n) => allowedCoins.has(n));
    const target = parseFloat(targetAmount);

    if (coins.length === 0) {
      setError("Please enter valid coin denominations from the allowed list.");
      setLoading(false);
      return;
    }

    if (isNaN(target) || target < 0 || target > 10000) {
      setError("Target amount must be a number between 0 and 10000.");
      setLoading(false);
      return;
    }

    const payload = {
      targetAmount: target,
      coinDenominations: coins,
    };

    try {
      const res = await fetch("http://localhost:8080/coin-change", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg);
      }

      const data = await res.json();
      setResult(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      <Content style={{ maxWidth: 800, margin: "auto", padding: 40 }}>
        <Typography>
          <Title level={2} style={{ textAlign: "center", color: "#1890ff" }}>
            Coin Change Calculator
          </Title>

          <Paragraph>
            This application calculates the <Text strong>minimum number of coins</Text>{" "}
            required to reach a given target amount. It uses a{" "}
            <Text strong>Java-based REST API</Text> that supports decimal precision
            and assumes infinite availability for each coin denomination.
          </Paragraph>

          <Title level={4}>Input Requirements:</Title>
          <ul>
            <li>
              <Text strong>Target Amount</Text>: Must be a number between{" "}
              <b>0</b> and <b>10,000.00</b>.
            </li>
            <li>
              <Text strong>Coin Denominations</Text>: Only allowed values are:{" "}
              <Text code>0.01, 0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10, 50, 100, 1000</Text>.
            </li>
          </ul>

          <Divider />

          <Form layout="vertical" onFinish={handleSubmit}>
            <Form.Item label="Target Amount">
              <Input
                type="number"
                step="0.01"
                placeholder="e.g. 7.03"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
              />
            </Form.Item>

            <Form.Item
              label="Coin Denominations (comma separated)"
              extra="Allowed: 0.01, 0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10, 50, 100, 1000"
              validateStatus={denomError ? "error" : ""}
              help={denomError ? "Only allowed denominations are permitted." : null}
            >
              <Input
                placeholder="e.g. 0.01, 0.5, 1, 5, 10"
                value={denominations}
                onChange={(e) => setDenominations(e.target.value)}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
              >
                Calculate Minimum Coins
              </Button>
            </Form.Item>
          </Form>

          {error && <Alert message={error} type="error" showIcon />}

          {result && (
            <div style={{ marginTop: 20 }}>
              <Title level={5}>Minimum Coins:</Title>
              <List
                bordered
                dataSource={result}
                renderItem={(item) => <List.Item>{item}</List.Item>}
              />
            </div>
          )}

          <Divider />
        </Typography>
      </Content>
    </Layout>
  );
}

export default App;
