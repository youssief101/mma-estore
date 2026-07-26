Client
    │
    │ Bearer Token
    ▼
authenticate middleware
    │
    ▼
req.user
    │
    ▼
getProfile()
    │
    ▼
MongoDB (populate addresses)
    │
    ▼
Return profile