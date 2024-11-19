from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()

    class Meta:
        db_table = 'products'

    def __str__(self):
        return self.name



class Order(models.Model):
    customer = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)


    class Meta:
        db_table = 'orders'

    def __str__(self):
        return f"Order {self.id} - {self.customer.username}"
    
class OrderItem(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    amount = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'order_items'

    def __str__(self):
        return f"{self.amount}x {self.product.name} in Order {self.order.id}"




