import { Button, Card, Table, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

function CategoriesPage() {
  return (
    <div>
      <Card
        bordered={false}
        style={{
          borderRadius: 20,
        }}
      >
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
              Categories
            </Title>

            <Text style={{ color: '#777' }}>
              Organize collections and artwork categories.
            </Text>
          </div>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            style={{
              background: '#A77833',
              borderColor: '#A77833',
              height: 42,
              borderRadius: 10,
              fontWeight: 700,
            }}
          >
            Add Category
          </Button>
        </div>

        <Table
          rowKey="id"
          dataSource={[]}
          columns={[
            {
              title: 'Category',
              dataIndex: 'name',
              key: 'name',
            },
            {
              title: 'Slug',
              dataIndex: 'slug',
              key: 'slug',
            },
            {
              title: 'Status',
              dataIndex: 'isActive',
              key: 'isActive',
            },
          ]}
        />
      </Card>
    </div>
  );
}

export default CategoriesPage;
