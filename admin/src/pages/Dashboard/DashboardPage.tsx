import { Card, Col, Row, Statistic, Typography } from 'antd';
import {
  AppstoreOutlined,
  PictureOutlined,
  ShoppingOutlined,
  TagsOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

function DashboardPage() {
  return (
    <div>
      <Title level={2} style={{ marginTop: 0, color: '#111210' }}>
        Dashboard
      </Title>

      <Text style={{ color: '#777' }}>
        Manage luxury artworks, categories, product galleries, inventory and
        ecommerce operations.
      </Text>

      <Row gutter={[20, 20]} style={{ marginTop: 28 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false}>
            <Statistic
              title="Total Products"
              value={0}
              prefix={<ShoppingOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false}>
            <Statistic title="Categories" value={0} prefix={<TagsOutlined />} />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false}>
            <Statistic
              title="Gallery Images"
              value={0}
              prefix={<PictureOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false}>
            <Statistic
              title="Collections"
              value={0}
              prefix={<AppstoreOutlined />}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default DashboardPage;
