import { useEffect, useState } from 'react';
import {
  Button,
  Form,
  Image,
  Input,
  InputNumber,
  Modal,
  Select,
  Space,
  Switch,
  Upload,
  message,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';

import { getCategories, type Category } from '../../api/categoriesApi';
import { addProductImage, createProduct } from '../../api/productsApi';
import { uploadImage } from '../../api/uploadApi';

type ProductFormModalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

type UploadedGalleryImage = {
  url: string;
  publicId: string;
};

const createSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

function ProductFormModal({ open, onClose, onSuccess }: ProductFormModalProps) {
  const [form] = Form.useForm();
  const [categories, setCategories] = useState<Category[]>([]);
  const [mainImage, setMainImage] = useState('');
  const [galleryImages, setGalleryImages] = useState<UploadedGalleryImage[]>(
    [],
  );
  const [submitting, setSubmitting] = useState(false);
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  useEffect(() => {
    if (!open) return;

    getCategories()
      .then(setCategories)
      .catch(() => message.error('Failed to load categories'));
  }, [open]);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const title = event.target.value;
    form.setFieldValue('slug', createSlug(title));
  };

  const uploadMainImage = async (file: File) => {
    try {
      setUploadingMain(true);
      message.loading({
        content: 'Uploading main image...',
        key: 'mainUpload',
      });

      const result = await uploadImage(file);

      setMainImage(result.url);
      form.setFieldValue('imageUrl', result.url);

      message.success({
        content: 'Main image uploaded successfully',
        key: 'mainUpload',
      });
    } catch (error) {
      console.error(error);
      message.error({
        content: 'Main image upload failed',
        key: 'mainUpload',
      });
    } finally {
      setUploadingMain(false);
    }
  };

  const uploadGalleryImage = async (file: File) => {
    try {
      setUploadingGallery(true);
      message.loading({
        content: 'Uploading gallery image...',
        key: 'galleryUpload',
      });

      const result = await uploadImage(file);

      setGalleryImages((current) => [...current, result]);

      message.success({
        content: 'Gallery image uploaded successfully',
        key: 'galleryUpload',
      });
    } catch (error) {
      console.error(error);
      message.error({
        content: 'Gallery image upload failed',
        key: 'galleryUpload',
      });
    } finally {
      setUploadingGallery(false);
    }
  };

  const handleFinish = async (values: any) => {
    try {
      setSubmitting(true);

      const createdProduct = await createProduct({
        title: values.title,
        slug: values.slug,
        description: values.description,
        shortDescription: values.shortDescription,
        imageUrl: values.imageUrl,
        price: Number(values.price),
        comparePrice: values.comparePrice
          ? Number(values.comparePrice)
          : undefined,
        stock: Number(values.stock || 0),
        sku: values.sku,
        isFeatured: Boolean(values.isFeatured),
        isActive: values.isActive !== false,
        categoryId: values.categoryId,
      });

      await Promise.all(
        galleryImages.map((image, index) =>
          addProductImage(createdProduct.id, {
            imageUrl: image.url,
            altText: values.title,
            sortOrder: index + 1,
          }),
        ),
      );

      message.success('Product created successfully');
      form.resetFields();
      setMainImage('');
      setGalleryImages([]);
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      message.error('Failed to create product');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title="Add New Product"
      open={open}
      onCancel={onClose}
      footer={null}
      width={820}
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          stock: 0,
          isFeatured: false,
          isActive: true,
        }}
      >
        <Form.Item
          label="Product Title"
          name="title"
          rules={[{ required: true, message: 'Product title is required' }]}
        >
          <Input
            placeholder="Royal Heritage Canvas"
            onChange={handleTitleChange}
          />
        </Form.Item>

        <Form.Item
          label="Slug"
          name="slug"
          rules={[{ required: true, message: 'Slug is required' }]}
        >
          <Input placeholder="royal-heritage-canvas" />
        </Form.Item>

        <Form.Item
          label="Category"
          name="categoryId"
          rules={[{ required: true, message: 'Category is required' }]}
        >
          <Select
            placeholder="Select category"
            options={categories.map((category) => ({
              label: category.name,
              value: category.id,
            }))}
          />
        </Form.Item>

        <Form.Item
          name="imageUrl"
          hidden
          rules={[{ required: true, message: 'Main image is required' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Main Image" required>
          <Upload
            beforeUpload={(file) => {
              uploadMainImage(file);
              return false;
            }}
            maxCount={1}
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />} loading={uploadingMain}>
              {mainImage ? 'Change Main Image' : 'Upload Main Image'}
            </Button>
          </Upload>

          {mainImage && (
            <div style={{ marginTop: 12 }}>
              <Image
                src={mainImage}
                width={130}
                height={130}
                style={{ objectFit: 'cover', borderRadius: 12 }}
              />
            </div>
          )}
        </Form.Item>

        <Form.Item label="Gallery Images">
          <Upload
            beforeUpload={(file) => {
              uploadGalleryImage(file);
              return false;
            }}
            multiple
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />} loading={uploadingGallery}>
              Upload Gallery Images
            </Button>
          </Upload>

          {galleryImages.length > 0 && (
            <Space wrap style={{ marginTop: 12 }}>
              {galleryImages.map((image) => (
                <Image
                  key={image.publicId}
                  src={image.url}
                  width={90}
                  height={90}
                  style={{ objectFit: 'cover', borderRadius: 10 }}
                />
              ))}
            </Space>
          )}
        </Form.Item>

        <Form.Item label="Short Description" name="shortDescription">
          <Input placeholder="Short product intro" />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: 'Description is required' }]}
        >
          <Input.TextArea rows={4} placeholder="Full artwork story/details" />
        </Form.Item>

        <Form.Item
          label="Price"
          name="price"
          rules={[{ required: true, message: 'Price is required' }]}
        >
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="Compare Price" name="comparePrice">
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="Stock" name="stock">
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="SKU" name="sku">
          <Input placeholder="AK-001" />
        </Form.Item>

        <Form.Item
          label="Featured Product"
          name="isFeatured"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          label="Active Product"
          name="isActive"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          loading={submitting}
          block
          style={{
            height: 44,
            borderRadius: 10,
            background: '#A77833',
            borderColor: '#A77833',
            fontWeight: 700,
          }}
        >
          Create Product
        </Button>
      </Form>
    </Modal>
  );
}

export default ProductFormModal;
