import { Button, Card, Empty, Typography } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

function ProductGalleryPage() {
  return (
    <div>
      <Card bordered={false} style={{ borderRadius: 20 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 16,
            alignItems: 'center',
            marginBottom: 24,
          }}
        >
          <div>
            <Title level={2} style={{ marginTop: 0, marginBottom: 6 }}>
              Product Gallery
            </Title>

            <Text style={{ color: '#777' }}>
              Upload and manage multiple artwork gallery images.
            </Text>
          </div>

          <Button
            type="primary"
            icon={<UploadOutlined />}
            style={{
              background: '#A77833',
              borderColor: '#A77833',
              height: 42,
              borderRadius: 10,
              fontWeight: 700,
            }}
          >
            Upload Image
          </Button>
        </div>

        <Empty description="Gallery management will be connected next." />
      </Card>
    </div>
  );
}

export default ProductGalleryPage;
