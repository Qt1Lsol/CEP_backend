# API - Culture En Poche

## User

### /author/signup (POST)

Create a new author

| Body       | Type   | Required |
| ---------- | ------ | -------- |
| `email`    | string | Yes      |
| `password` | string | Yes      |

<br>
<br>

### /author/login (POST)

Log ann author

| Body       | Type   | Required |
| ---------- | ------ | -------- |
| `email`    | string | Yes      |
| `password` | string | Yes      |

<br>
<br>


## Offer

### /offers/ (GET)

Receive a list of offers.
Possibility to filter the results.

| Query      | Required | Description                                                                                                                                                                                                                                                 |
| ---------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `title`    | No       | get a list of offers that contain `title`                                                                                                                                                                                                                   |
| `priceMin` | No       | get offers above `priceMin`                                                                                                                                                                                                                                 |
| `priceMax` | No       | get offers below `priceMax`                                                                                                                                                                                                                                 |
| `sort`     | No       | `date-asc` : get a list of offers sort by ascending dates <br> `date-desc`: get a list of offers sort by descending dates <br> `price-asc`: get a list of offers sort by ascending prices <br> `price-desc`: get a list of offers sort by descending prices |
| `page`     | No       | set the results page                                                                                                                                                                                                                                        |
| `limit`    | No       | set the limit of results                                                                                                                                                                                                                                    |

<br>
<br>

### /offer/:id (GET)

Get an offer

| Param | Required | Description |
| ----- | -------- | ----------- |
| `id`  | Yes      | offer id    |

<br>
<br>   
 
### /offer/publish (POST)
Create a new offer
| formData      | Required | Description
| ------------- | -------- | -----------
| `title`       | Yes      | offer title
| `description` | Yes      | product description
| `price`       | Yes      | product price
| `brand`       | Yes      | product brand
| `size`        | Yes      | product size
| `condition`   | Yes      | product condition
| `color`       | Yes      | offer color
| `city`        | Yes      | the city in which the offer is located
| `picture`     | Yes      | product picture

<br>

| Headers        | Required | Description |
| -------------- | -------- | ----------- |
| `Bearer token` | Yes      | user token  |

<br>
<br>

### /offer/update/:id (PUT)

Update an offer

| Param | Required | Description |
| ----- | -------- | ----------- |
| `id`  | Yes      | offer id    |

<br>

| formData      | Required | Description                            |
| ------------- | -------- | -------------------------------------- |
| `title`       | No       | offer title                            |
| `description` | No       | product description                    |
| `price`       | No       | product price                          |
| `brand`       | No       | product brand                          |
| `size`        | No       | product size                           |
| `condition`   | No       | product condition                      |
| `color`       | No       | offer color                            |
| `city`        | No       | the city in which the offer is located |
| `picture`     | No       | product picture                        |

<br>

| Headers        | Required | Description |
| -------------- | -------- | ----------- |
| `Bearer token` | Yes      | user token  |

<br>
<br>

### /offer/delete/:id (DELETE)

Delete an offer

| Param | Required | Description |
| ----- | -------- | ----------- |
| `id`  | Yes      | offer id    |

<br>

| Headers        | Required | Description |
| -------------- | -------- | ----------- |
| `Bearer token` | Yes      | user token  |

<br>
<br>

### /reset-offers (GET)

This route resets the offers database.
Do not consider it.
#� �C�E�P�_�b�a�c�k�e�n�d�
�
�#� �C�E�P�_�b�a�c�k�e�n�d�
�
�#� �C�E�P�_�b�a�c�k�e�n�d�
�
�
