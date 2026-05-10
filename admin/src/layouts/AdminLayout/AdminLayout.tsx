import { Layout, Menu, Typography } from 'antd';
import {
  DashboardOutlined,
  PictureOutlined,
  ShoppingOutlined,
  TagsOutlined,
} from '@ant-design/icons';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedKey = location.pathname.split('/')[1] || 'dashboard';

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={260} style={{ background: '#111210' }}>
        <div
          style={{
            height: 90,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <Title level={3} style={{ color: '#C3976A', margin: 0 }}>
            ARTSKART
          </Title>
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={({ key }) => navigate(key === 'dashboard' ? '/' : `/${key}`)}
          style={{ background: '#111210', paddingTop: 20 }}
          items={[
            {
              key: 'dashboard',
              icon: <DashboardOutlined />,
              label: 'Dashboard',
            },
            { key: 'products', icon: <ShoppingOutlined />, label: 'Products' },
            { key: 'categories', icon: <TagsOutlined />, label: 'Categories' },
            {
              key: 'gallery',
              icon: <PictureOutlined />,
              label: 'Product Gallery',
            },
          ]}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            background: '#fff',
            paddingInline: 32,
            display: 'flex',
            alignItems: 'center',
            borderBottom: '1px solid #ececec',
          }}
        >
          <div>
            <Title level={4} style={{ margin: 0, color: '#111210' }}>
              Artskart Admin
            </Title>
            <Text style={{ color: '#777' }}>
              Luxury Art Ecommerce Management
            </Text>
          </div>
        </Header>

        <Content style={{ padding: 32, background: '#F3EAE3' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

export default AdminLayout;
