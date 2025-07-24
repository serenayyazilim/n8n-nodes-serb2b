import {
	IDataObject,
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

import {
	serB2BApiRequest,
	serB2BApiRequestAllItems,
	validateJSON,
} from './GenericFunctions';

export class SerB2B implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'SerB2B',
		name: 'serB2B',
		icon: 'file:serb2b.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with SerB2B API',
		defaults: {
			name: 'SerB2B',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'serB2BApi',
				required: true,
			},
		],
		properties: [
			// Resource
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				required: true,
				options: [
					{
						name: 'Customer',
						value: 'customer',
					},
					{
						name: 'Order',
						value: 'order',
					},
					{
						name: 'Product',
						value: 'product',
					},
					{
						name: 'Category',
						value: 'category',
					},
					{
						name: 'Brand',
						value: 'brand',
					},
				],
				default: 'customer',
			},

			// Customer Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				required: true,
				displayOptions: {
					show: {
						resource: ['customer'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new customer',
						action: 'Create customer',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a customer',
						action: 'Delete customer',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a customer',
						action: 'Get customer',
					},
					{
						name: 'Get All',
						value: 'getAll',
						description: 'Get all customers',
						action: 'Get all customers',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a customer',
						action: 'Update customer',
					},
				],
				default: 'create',
			},

			// Product Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				required: true,
				displayOptions: {
					show: {
						resource: ['product'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new product',
						action: 'Create product',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a product',
						action: 'Delete product',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a product',
						action: 'Get product',
					},
					{
						name: 'Get All',
						value: 'getAll',
						description: 'Get all products',
						action: 'Get all products',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a product',
						action: 'Update product',
					},
				],
				default: 'create',
			},

			// Order Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				required: true,
				displayOptions: {
					show: {
						resource: ['order'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new order',
						action: 'Create order',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete an order',
						action: 'Delete order',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get an order',
						action: 'Get order',
					},
					{
						name: 'Get All',
						value: 'getAll',
						description: 'Get all orders',
						action: 'Get all orders',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update an order',
						action: 'Update order',
					},
				],
				default: 'create',
			},

			// Category Operations  
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				required: true,
				displayOptions: {
					show: {
						resource: ['category'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new category',
						action: 'Create category',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a category',
						action: 'Delete category',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a category',
						action: 'Get category',
					},
					{
						name: 'Get All',
						value: 'getAll',
						description: 'Get all categories',
						action: 'Get all categories',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a category',
						action: 'Update category',
					},
				],
				default: 'create',
			},

			// Brand Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				required: true,
				displayOptions: {
					show: {
						resource: ['brand'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new brand',
						action: 'Create brand',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a brand',
						action: 'Delete brand',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a brand',
						action: 'Get brand',
					},
					{
						name: 'Get All',
						value: 'getAll',
						description: 'Get all brands',
						action: 'Get all brands',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a brand',
						action: 'Update brand',
					},
				],
				default: 'create',
			},

			// Customer operations
			{
				displayName: 'Customer ID',
				name: 'customerId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['customer'],
						operation: ['delete', 'get', 'update'],
					},
				},
				default: '',
				description: 'ID of the customer',
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['customer'],
						operation: ['create'],
					},
				},
				default: '',
				placeholder: 'name@email.com',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['customer'],
						operation: ['create'],
					},
				},
				default: '',
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['customer'],
						operation: ['create', 'update'],
					},
				},
				options: [
					{
						displayName: 'Company',
						name: 'company',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Phone',
						name: 'phone',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Mobile',
						name: 'mobile',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Address',
						name: 'address',
						type: 'string',
						default: '',
					},
					{
						displayName: 'City',
						name: 'city',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Country',
						name: 'country',
						type: 'string',
						default: 'Turkey',
					},
					{
						displayName: 'Tax Number',
						name: 'tax_number',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Tax Office',
						name: 'tax_office',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Is Active',
						name: 'is_active',
						type: 'boolean',
						default: true,
					},
					{
						displayName: 'Is Approved',
						name: 'is_approved',
						type: 'boolean',
						default: false,
					},
				],
			},

			// Order operations
			{
				displayName: 'Order ID',
				name: 'orderId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['order'],
						operation: ['delete', 'get', 'update'],
					},
				},
				default: '',
				description: 'ID of the order',
			},
			{
				displayName: 'Customer ID',
				name: 'customerId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['order'],
						operation: ['create'],
					},
				},
				default: '',
			},
			{
				displayName: 'Items',
				name: 'items',
				type: 'json',
				required: true,
				displayOptions: {
					show: {
						resource: ['order'],
						operation: ['create'],
					},
				},
				default: '[]',
				description: 'Array of order items',
			},

			// Product operations
			{
				displayName: 'Product ID',
				name: 'productId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['product'],
						operation: ['delete', 'get', 'update'],
					},
				},
				default: '',
				description: 'ID of the product',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['product'],
						operation: ['create'],
					},
				},
				default: '',
			},
			{
				displayName: 'Code',
				name: 'code',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['product'],
						operation: ['create'],
					},
				},
				default: '',
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['product'],
						operation: ['create', 'update'],
					},
				},
				options: [
					{
						displayName: 'Product Name (isim)',
						name: 'isim',
						type: 'string',
						default: '',
						description: 'Product name',
					},
					{
						displayName: 'Brand Name (marka_isim)',
						name: 'marka_isim',
						type: 'string',
						default: '',
						description: 'Brand name',
					},
					{
						displayName: 'Category Name (kategori_isim)',
						name: 'kategori_isim',
						type: 'string',
						default: '',
						description: 'Category name',
					},
					{
						displayName: 'Product Code (kod)',
						name: 'kod',
						type: 'string',
						default: '',
						description: 'Product code/SKU',
					},
					{
						displayName: 'Price (fiyat)',
						name: 'fiyat',
						type: 'string',
						default: '',
						description: 'Product price as string',
					},
					{
						displayName: 'Barcode (barkod)',
						name: 'barkod',
						type: 'string',
						default: '',
						description: 'Product barcode',
					},
					{
						displayName: 'Tax Rate (tax)',
						name: 'tax',
						type: 'number',
						default: 0,
						description: 'Tax rate percentage',
					},
					{
						displayName: 'Package Quantity (paket)',
						name: 'paket',
						type: 'string',
						default: '',
						description: 'Package quantity',
					},
					{
						displayName: 'Stock Control (stok_kontrol)',
						name: 'stok_kontrol',
						type: 'options',
						options: [
							{ name: 'Disabled', value: 0 },
							{ name: 'Enabled', value: 1 },
						],
						default: 1,
						description: 'Enable/disable stock control',
					},
					{
						displayName: 'Min Stock Amount (min_stok_miktar)',
						name: 'min_stok_miktar',
						type: 'string',
						default: '',
						description: 'Minimum stock amount',
					},
					{
						displayName: 'Age Group (yas_grubu)',
						name: 'yas_grubu',
						type: 'string',
						default: '',
						description: 'Age group (e.g., "1-2-3-4")',
					},
					{
						displayName: 'Stock Quantity (stok_adet)',
						name: 'stok_adet',
						type: 'string',
						default: '',
						description: 'Current stock quantity',
					},
					{
						displayName: 'Status (durum)',
						name: 'durum',
						type: 'options',
						options: [
							{ name: 'Inactive', value: 0 },
							{ name: 'Active', value: 1 },
						],
						default: 1,
						description: 'Product status',
					},
					{
						displayName: 'Description (aciklama)',
						name: 'aciklama',
						type: 'string',
						typeOptions: {
							rows: 4,
						},
						default: '',
						description: 'Product description',
					},
					{
						displayName: 'Custom Fields',
						name: 'custom_fields',
						type: 'fixedCollection',
						default: {},
						description: 'Custom field values',
						typeOptions: {
							multipleValues: true,
						},
						options: [
							{
								name: 'field',
								displayName: 'Custom Field',
								values: [
									{
										displayName: 'Field Name',
										name: 'name',
										type: 'string',
										default: '',
										description: 'Custom field name (e.g., "ozelseri_2024")',
									},
									{
										displayName: 'Field Value',
										name: 'value',
										type: 'string',
										default: '',
										description: 'Custom field value',
									},
								],
							},
						],
					},
				],
			},

			// Get All operations
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				displayOptions: {
					show: {
						operation: ['getAll'],
					},
				},
				default: false,
				description: 'Whether to return all results or only up to a given limit',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['getAll'],
						returnAll: [false],
					},
				},
				typeOptions: {
					minValue: 1,
					maxValue: 500,
				},
				default: 50,
				description: 'Max number of results to return',
			},
			{
				displayName: 'Filters',
				name: 'filters',
				type: 'collection',
				placeholder: 'Add Filter',
				default: {},
				displayOptions: {
					show: {
						operation: ['getAll'],
					},
				},
				options: [
					{
						displayName: 'Status',
						name: 'status',
						type: 'options',
						options: [
							{
								name: 'Active',
								value: 1,
							},
							{
								name: 'Inactive',
								value: 0,
							},
						],
						default: 1,
					},
				],
			},
		],
	};

	methods = {
		loadOptions: {
			async getCategories(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const categories = await serB2BApiRequest.call(this, 'GET', '/Category');
				for (const category of categories) {
					returnData.push({
						name: category.kategori_adi,
						value: category.id,
					});
				}
				return returnData;
			},

			async getBrands(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const brands = await serB2BApiRequest.call(this, 'GET', '/Brand');
				for (const brand of brands) {
					returnData.push({
						name: brand.marka_adi,
						value: brand.id,
					});
				}
				return returnData;
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		let responseData;
		const qs: IDataObject = {};

		for (let i = 0; i < items.length; i++) {
			try {
				if (resource === 'customer') {
					if (operation === 'create') {
						const email = this.getNodeParameter('email', i) as string;
						const name = this.getNodeParameter('name', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = {
							mail: email,
							yetkili: name,
							...additionalFields,
						};

						responseData = await serB2BApiRequest.call(this, 'POST', '/Customer', body);
					} else if (operation === 'delete') {
						const customerId = this.getNodeParameter('customerId', i) as string;
						responseData = await serB2BApiRequest.call(this, 'DELETE', `/Customer/${customerId}`);
					} else if (operation === 'get') {
						const customerId = this.getNodeParameter('customerId', i) as string;
						responseData = await serB2BApiRequest.call(this, 'GET', `/Customer/${customerId}`);
					} else if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;

						if (returnAll) {
							responseData = await serB2BApiRequestAllItems.call(this, 'GET', '/Customer', undefined, filters);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							qs.limit = limit;
							Object.assign(qs, filters);
							responseData = await serB2BApiRequest.call(this, 'GET', '/Customer', undefined, qs);
						}
					} else if (operation === 'update') {
						const customerId = this.getNodeParameter('customerId', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = {
							...additionalFields,
						};

						responseData = await serB2BApiRequest.call(this, 'PUT', `/Customer/${customerId}`, body);
					}
				} else if (resource === 'order') {
					if (operation === 'create') {
						const customerId = this.getNodeParameter('customerId', i) as string;
						const items = this.getNodeParameter('items', i) as string;

						const body: IDataObject = {
							customer_id: customerId,
							items: validateJSON(items),
						};

						responseData = await serB2BApiRequest.call(this, 'POST', '/Order', body);
					} else if (operation === 'delete') {
						const orderId = this.getNodeParameter('orderId', i) as string;
						responseData = await serB2BApiRequest.call(this, 'DELETE', `/Order/${orderId}`);
					} else if (operation === 'get') {
						const orderId = this.getNodeParameter('orderId', i) as string;
						responseData = await serB2BApiRequest.call(this, 'GET', `/Order/${orderId}`);
					} else if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;

						if (returnAll) {
							responseData = await serB2BApiRequestAllItems.call(this, 'GET', '/Order', undefined, filters);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							qs.limit = limit;
							Object.assign(qs, filters);
							responseData = await serB2BApiRequest.call(this, 'GET', '/Order', undefined, qs);
						}
					} else if (operation === 'update') {
						const orderId = this.getNodeParameter('orderId', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						responseData = await serB2BApiRequest.call(this, 'PUT', `/Order/${orderId}`, additionalFields);
					}
				} else if (resource === 'product') {
					if (operation === 'create') {
						const name = this.getNodeParameter('name', i) as string;
						const code = this.getNodeParameter('code', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = {
							urun_adi: name,
							stok_kodu: code,
							...additionalFields,
						};

						responseData = await serB2BApiRequest.call(this, 'POST', '/Product', body);
					} else if (operation === 'delete') {
						const productId = this.getNodeParameter('productId', i) as string;
						responseData = await serB2BApiRequest.call(this, 'DELETE', `/Product/${productId}`);
					} else if (operation === 'get') {
						const productId = this.getNodeParameter('productId', i) as string;
						responseData = await serB2BApiRequest.call(this, 'GET', `/Product/${productId}`);
					} else if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;

						if (returnAll) {
							responseData = await serB2BApiRequestAllItems.call(this, 'GET', '/Product', undefined, filters);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							qs.limit = limit;
							Object.assign(qs, filters);
							responseData = await serB2BApiRequest.call(this, 'GET', '/Product', undefined, qs);
						}
					} else if (operation === 'update') {
						const productId = this.getNodeParameter('productId', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						// Handle custom fields
						const body: IDataObject = {};
						
						// Process all the additional fields
						Object.keys(additionalFields).forEach(key => {
							if (key === 'custom_fields') {
								// Handle custom fields collection
								const customFieldsCollection = additionalFields[key] as IDataObject;
								if (customFieldsCollection.field) {
									const fields = customFieldsCollection.field as IDataObject[];
									fields.forEach((field: IDataObject) => {
										if (field.name && field.value) {
											body[`custom_field_${field.name}`] = field.value;
										}
									});
								}
							} else {
								// Add other fields directly
								body[key] = additionalFields[key];
							}
						});

						responseData = await serB2BApiRequest.call(this, 'PUT', `/Product/${productId}`, body);
					}
				}

				if (Array.isArray(responseData)) {
					returnData.push(...this.helpers.returnJsonArray(responseData));
				} else {
					returnData.push(this.helpers.returnJsonArray(responseData)[0]);
				}

			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: (error as Error).message } });
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}