# RemesaChain - Plataforma Descentralizada de Remesas para Ecuador

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/waltersosas-projects/v0-remesa-chain-landing-page)
[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js%2015-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

## 📋 Tabla de Contenidos

- [Descripción del Proyecto](#-descripción-del-proyecto)
- [Características Principales](#-características-principales)
- [Arquitectura Técnica](#-arquitectura-técnica)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Uso del Proyecto](#-uso-del-proyecto)
- [Estructura del Código](#-estructura-del-código)
- [API y Servicios](#-api-y-servicios)
- [Blockchain Integrations](#-blockchain-integrations)
- [Contribución](#-contribución)
- [Licencia](#-licencia)

## 🎯 Descripción del Proyecto

RemesaChain es una plataforma descentralizada de remesas que revoluciona el envío de dinero a Ecuador mediante tecnología blockchain. El proyecto aborda los problemas tradicionales de las remesas:

### Problemas que Resuelve
- **Altas comisiones**: Reduce de 8-15% a $1 USD fijo por transacción
- **Lentitud**: Acelera de 2-5 días a minutos
- **Exclusión financiera**: Facilita acceso en zonas rurales
- **Falta de transparencia**: Todas las transacciones son verificables en blockchain

### Flujo de Remesas
1. **Envío**: USDC desde wallet del remitente
2. **Escrow**: Fondos protegidos en contrato inteligente
3. **P2P**: Emparejamiento con operador local
4. **Entrega**: USD depositado en cuenta bancaria ecuatoriana

## ✨ Características Principales

### 🔄 Sistema de Remesas P2P
- Envío instantáneo de USDC
- Conversión automática a USD usando oráculos Flare (FTSO)
- Red de operadores P2P locales
- Sistema de escrow para máxima seguridad
- Comisión fija de $1 USD por transacción

### 👨‍👩‍👧‍👦 Grupos Familiares ENS
- Gestión de grupos familiares con identidades ENS
- Contratos inteligentes para remesas compartidas
- Permisos granulares (retirar/recibir fondos)
- Sistema de expiración automática (7 días)
- Administración descentralizada

### 📊 Oráculo Flare (FTSO)
- Precios en tiempo real de USDC/USD
- Actualización automática cada 30 segundos
- Datos verificados para máxima transparencia
- Historial de precios para auditoría y compliance

### 💾 Almacenamiento Filecoin
- Vouchers de transacción permanentes
- Registros de auditoría descentralizados
- Documentos verificables en blockchain
- Backup automático de transacciones

### 🏦 Identidad Bancaria
- Gestión de cuentas bancarias ecuatorianas
- Verificación de identidad KYC
- Depósitos directos en USD
- Integración con bancos locales

## 🏗️ Arquitectura Técnica

### Stack Frontend
- **Framework**: Next.js 15 con App Router
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4.1.9
- **Components**: Radix UI (Accordion, Dialog, Tabs, etc.)
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod validation
- **State Management**: React Context + Hooks

### Integraciones Blockchain
- **Base**: L2 de Ethereum para transacciones rápidas
- **ENS**: Identidades descentralizadas
- **Filecoin**: Almacenamiento descentralizado
- **Flare**: Oráculos de precios (FTSO)
- **Lisk**: Plataforma blockchain adicional

### Servicios Backend
- **Oráculos**: Flare FTSO para precios en tiempo real
- **Almacenamiento**: Filecoin para documentos permanentes
- **Contratos**: Simulación de contratos inteligentes
- **Wallet**: Integración con wallets Web3

## 🛠️ Tecnologías Utilizadas

### Core Dependencies
```json
{
  "next": "15.2.4",
  "react": "^19",
  "react-dom": "^19",
  "typescript": "^5"
}
```

### UI & Styling
```json
{
  "@radix-ui/react-*": "latest",
  "tailwindcss": "^4.1.9",
  "framer-motion": "latest",
  "lucide-react": "^0.454.0"
}
```

### Forms & Validation
```json
{
  "react-hook-form": "^7.60.0",
  "@hookform/resolvers": "^3.10.0",
  "zod": "3.25.67"
}
```

### Blockchain & Web3
```json
{
  "@remix-run/react": "latest",
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1"
}
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- pnpm (recomendado) o npm
- Git

### Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/your-username/remesachain-hackathon.git
cd remesachain-hackathon
```

2. **Instalar dependencias**
```bash
pnpm install
# o
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env.local
```

4. **Ejecutar en desarrollo**
```bash
pnpm dev
# o
npm run dev
```

5. **Abrir en el navegador**
```
http://localhost:3000
```

### Scripts Disponibles

```bash
# Desarrollo
pnpm dev          # Servidor de desarrollo
pnpm build        # Build de producción
pnpm start        # Servidor de producción
pnpm lint         # Linting con ESLint
```

## 📖 Uso del Proyecto

### 1. Página Principal (`/`)
- **Landing page** con información del proyecto
- **Formularios** para operadores P2P y sponsors
- **Tasas en tiempo real** desde oráculos Flare
- **Explicación del flujo** de remesas

### 2. Demo de Remesas (`/demo`)
- **Simulación completa** del flujo de remesas
- **Envío a grupos familiares** o individuos
- **Recepción y configuración** bancaria
- **Generación de vouchers** verificables

### 3. Grupos Familiares (`/family-groups`)
- **Creación y gestión** de grupos familiares
- **Gestión de miembros** con permisos granulares
- **Estadísticas de transacciones**
- **Retiro de fondos** compartidos

### 4. Operador P2P (`/operator`)
- **Registro de operadores** P2P
- **Gestión de transacciones** locales
- **Comisiones por operación**

## 📁 Estructura del Código

```
remesachain-hackathon/
├── app/                          # Next.js App Router
│   ├── demo/                     # Demo de remesas
│   ├── family-groups/            # Gestión de grupos familiares
│   ├── operator/                 # Registro de operadores P2P
│   ├── globals.css              # Estilos globales
│   ├── layout.tsx               # Layout principal
│   └── page.tsx                 # Página principal
├── components/                   # Componentes React
│   ├── ui/                      # Componentes de UI base
│   ├── banking-identity-manager.tsx
│   ├── family-member-selector.tsx
│   ├── language-provider.tsx
│   ├── real-time-rates.tsx
│   ├── wallet-connect-button.tsx
│   └── wallet-provider.tsx
├── lib/                         # Servicios y utilidades
│   ├── ens-service.ts           # Servicio ENS
│   ├── family-contract.ts       # Contratos familiares
│   ├── filecoin-storage.ts      # Almacenamiento Filecoin
│   ├── flare-oracle.ts          # Oráculos Flare
│   └── utils.ts                 # Utilidades generales
├── public/                      # Archivos estáticos
├── styles/                      # Estilos adicionales
└── package.json                 # Dependencias y scripts
```

## 🔌 API y Servicios

### FlareOracle Service
```typescript
// Obtener precio USDC/USD en tiempo real
const oracle = FlareOracle.getInstance()
const priceData = await oracle.getUSDCPrice()

// Calcular monto a recibir
const conversion = await oracle.calculateReceiveAmount(100)
```

### FamilyContract Service
```typescript
// Crear grupo familiar
const contractService = FamilyContractService.getInstance()
const groupId = await contractService.deployFamilyContract(address, name)

// Enviar remesa a grupo
const remittance = await contractService.sendToFamilyGroup(
  senderAddress, 
  groupId, 
  amount
)
```

### FilecoinStorage Service
```typescript
// Almacenar documento en Filecoin
const storage = FilecoinStorage.getInstance()
const documentId = await storage.storeDocument({
  type: "voucher",
  content: voucherContent,
  metadata: { transactionId, timestamp }
})
```

### ENS Service
```typescript
// Crear grupo familiar con ENS
const ensService = ENSService.getInstance()
const group = await ensService.createFamilyGroup(
  adminAddress, 
  groupName, 
  ensName
)
```

## ⛓️ Blockchain Integrations

### Base Network
- **Propósito**: Transacciones rápidas y económicas
- **Función**: L2 de Ethereum para operaciones principales
- **Ventajas**: Baja latencia, costos reducidos

### ENS (Ethereum Name Service)
- **Propósito**: Identidades descentralizadas
- **Función**: Nombres legibles para grupos familiares
- **Ejemplo**: `familia-gonzalez.eth`

### Filecoin
- **Propósito**: Almacenamiento descentralizado
- **Función**: Vouchers y documentos permanentes
- **Ventajas**: Inmutabilidad, verificación

### Flare Network (FTSO)
- **Propósito**: Oráculos de precios
- **Función**: Precios USDC/USD en tiempo real
- **Actualización**: Cada 30 segundos

### Lisk
- **Propósito**: Plataforma blockchain adicional
- **Función**: Operaciones complementarias

## 🎨 Características de UX/UI

### Diseño Responsive
- **Mobile-first**: Optimizado para dispositivos móviles
- **Desktop**: Interfaz completa para escritorio
- **Tablet**: Adaptación automática

### Tema y Accesibilidad
- **Modo oscuro/claro**: Soporte completo
- **Accesibilidad**: Cumple estándares WCAG
- **Internacionalización**: Español e inglés

### Animaciones
- **Framer Motion**: Transiciones fluidas
- **Micro-interacciones**: Feedback visual
- **Loading states**: Estados de carga elegantes

## 🔐 Seguridad

### Características de Seguridad
1. **Sistema de Escrow**: Protege todas las transacciones
2. **Permisos Granulares**: Control de acceso por miembro
3. **Expiración Automática**: Fondos expiran en 7 días
4. **Verificación Blockchain**: Transacciones verificables
5. **Almacenamiento Descentralizado**: Documentos permanentes

### Mejores Prácticas
- Validación de entrada con Zod
- Sanitización de datos
- Manejo seguro de wallets
- Verificación de permisos

## 📊 Modelo de Negocio

### Estructura de Comisiones
- **Comisión fija**: $1 USD por transacción
- **Comisión de red**: $0.25 USD
- **Operadores P2P**: Hasta 0.5% por transacción
- **Sin comisiones ocultas**: Transparencia total

### Beneficios
- **Para remitentes**: Costos reducidos, velocidad
- **Para receptores**: Acceso directo a USD
- **Para operadores**: Ingresos por comisiones
- **Para la plataforma**: Comisión fija sostenible

## 🚧 Estado del Proyecto

### ✅ Completado
- [x] Arquitectura completa del frontend
- [x] Sistema de grupos familiares
- [x] Integración con oráculos Flare
- [x] Almacenamiento Filecoin
- [x] Sistema de identidad bancaria
- [x] Demo funcional completo
- [x] Soporte multilingüe
- [x] UI/UX moderna y responsive

### 🔄 En Desarrollo
- [ ] Contratos inteligentes reales
- [ ] Integración con wallets reales
- [ ] KYC/AML compliance
- [ ] Partnerships con bancos ecuatorianos
- [ ] Auditoría de seguridad

### 📋 Roadmap
- [ ] Lanzamiento en testnet
- [ ] Integración con más blockchains
- [ ] App móvil nativa
- [ ] API pública para desarrolladores
- [ ] Expansión a otros países

## 🤝 Contribución

### Cómo Contribuir
1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Guías de Contribución
- Sigue las convenciones de código existentes
- Añade tests para nuevas funcionalidades
- Actualiza la documentación según sea necesario
- Mantén el código limpio y bien documentado

### Reportar Bugs
- Usa el sistema de issues de GitHub
- Incluye pasos para reproducir el bug
- Añade screenshots si es relevante
- Especifica tu entorno (OS, navegador, etc.)

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Contacto

- **Proyecto**: [RemesaChain](https://vercel.com/waltersosas-projects/v0-remesa-chain-landing-page)
- **Desarrollo**: [v0.app](https://v0.app/chat/projects/Niz6vpZZGm0)
- **Issues**: [GitHub Issues](https://github.com/your-username/remesachain-hackathon/issues)

## 🙏 Agradecimientos

- **Base Network** por la infraestructura L2
- **ENS** por las identidades descentralizadas
- **Filecoin** por el almacenamiento descentralizado
- **Flare Network** por los oráculos de precios
- **Lisk** por la plataforma blockchain
- **Comunidad Web3** por el apoyo y feedback

---

**RemesaChain** - Revolucionando las remesas familiares para Ecuador con tecnología blockchain descentralizada.
