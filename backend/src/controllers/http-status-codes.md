| Situation               |             Status            |
| ----------------------- | :---------------------------: |
| Registration successful |        **201 Created**        |
| Username exists         |        **409 Conflict**       |
| Email exists            |        **409 Conflict**       |
| Unexpected server error | **500 Internal Server Error** |

| Situation           | Status                        |
| ------------------- | ----------------------------- |
| Login successful    | **200 OK**                    |
| Invalid credentials | **401 Unauthorized**          |
| Account disabled    | **403 Forbidden**             |

