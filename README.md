# E-Ticaret Uygulaması

Pinsoft stajında geliştirdiğim e-ticaret uygulaması. Kullanıcı ürünleri listeleyip arar, sepete ekler ve sipariş verir; yönetici ürünleri ve siparişleri yönetir.

```text
backend/table/   Spring Boot API
frontend/        Next.js arayüz
```

## Backend

Java, Spring Boot, Spring Data JPA, Spring Security, JWT, PostgreSQL, Liquibase, MapStruct, Swagger.

| Uç | Ne yapar |
| --- | --- |
| `/api/auth` | Kayıt ve giriş (JWT döner) |
| `/api/products`, `/api/categories` | Ürün listeleme, detay, arama |
| `/api/cart` | Sepete ekleme, çıkarma, sepeti görme |
| `/api/orders` | Sepetten sipariş oluşturma, siparişleri listeleme |
| `/api/admin/products`, `/api/admin/orders` | Yalnızca `ADMIN` rolü: ürün ve sipariş yönetimi |

Tablolar ve başlangıç verisi Liquibase changelog'larıyla kurulur (`src/main/resources/db/changelog`). Hatalar `GlobalExceptionHandler` içinde tek formatta döner.

## Çalıştırma

Gerekenler: JDK 17+, Node.js, PostgreSQL.

```bash
export DB_URL=jdbc:postgresql://localhost:5432/eticaret
export DB_USERNAME=postgres
export DB_PASSWORD=<parola>
export JWT_SECRET=<en-az-32-karakterlik-anahtar>

cd backend/table
./mvnw spring-boot:run
```

Swagger: `http://localhost:8080/swagger-ui.html`

```bash
cd frontend
npm install
npm run dev     # http://localhost:3000
```
