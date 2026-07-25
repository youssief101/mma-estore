customer APIs
| Method | Endpoint                     | Authentication |
| ------ | ---------------------------- | -------------- |
| GET    | `/api/users/profile`         | Customer       |
| PUT    | `/api/users/profile`         | Customer       |
| PUT    | `/api/users/change-password` | Customer       |
| GET    | `/api/users/addresses`       | Customer       |
| POST   | `/api/users/addresses`       | Customer       |
| PUT    | `/api/users/addresses/:id`   | Customer       |
| DELETE | `/api/users/addresses/:id`   | Customer       |

admin APIs
| Method | Endpoint                | Authentication |
| ------ | ----------------------- | -------------- |
| GET    | `/api/users`            | Admin          |
| GET    | `/api/users/:id`        | Admin          |
| PATCH  | `/api/users/:id/status` | Admin          |
| DELETE | `/api/users/:id`        | Admin          |
