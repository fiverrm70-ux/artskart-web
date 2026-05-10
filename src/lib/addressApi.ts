import { api } from './api';

export type ApiAddress = {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  email?: string | null;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AddressPayload = {
  fullName: string;
  phone: string;
  email?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  isDefault?: boolean;
};

export async function getMyAddresses() {
  const response = await api.get<ApiAddress[]>('/address');
  return response.data;
}

export async function createAddress(payload: AddressPayload) {
  const response = await api.post<ApiAddress>('/address', payload);
  return response.data;
}

export async function updateAddress(
  addressId: string,
  payload: Partial<AddressPayload>,
) {
  const response = await api.patch<ApiAddress>(
    `/address/${addressId}`,
    payload,
  );
  return response.data;
}

export async function deleteAddress(addressId: string) {
  const response = await api.delete<{ message: string }>(
    `/address/${addressId}`,
  );
  return response.data;
}
