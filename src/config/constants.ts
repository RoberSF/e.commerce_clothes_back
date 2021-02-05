// Configuración de constantes de configuración pero para el entorno de producción

import environment from './environments'; // Al estar al mismo nivel hacemos ./

if (process.env.NODE_ENV !== 'production') {
  const env = environment;
}


export const SECRET_KEY =
  process.env.SECRET || 'MEANgraphqlRober';


export enum COLLECTIONS {
    USERS = 'users',
    TAGS = 'tags',
    PRODUCTS_ITEMS = 'products',
    POSTS = 'posts',
    PRODUCTS_SIZES = 'product_tallas',
    PRODUCTS_COLORS = 'product_color',
    SIZES = 'tallas',
    COLORS = 'colors',
    CATEGORIAS = 'categorias',
    SALES = 'sales'
}


export enum MESSAGES {
  TOKEN_VERICATION_FAILED = 'token no valido, inicia sesion de nuevo'
}

/**
 * H = Horas
 * M = Minutos
 * D = Días
 */
export enum EXPIRETIME {
  H1 = 60 * 60,
  H24 = 24 * H1,
  M15 = H1 / 4,
  M20 = H1 / 3,
  D3 = H24 * 3
}

export enum ACTIVE_VALUES_FILTER {
  ALL = 'ALL',
  INACTIVE = 'INACTIVE',
  ACTIVE = 'ACTIVE'
}

export enum SUBSCRIPTIONS_EVENT {
  UPDATE_STOCK_PRODUCT = 'UPDATE_STOCK_PRODUCT'
}

export enum ROLE {
  CLIENT = 'CLIENT',
  ADMIN = 'ADMIN'
}