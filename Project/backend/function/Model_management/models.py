from django.db import models

class Model(models.Model):
    model_id = models.AutoField(primary_key=True)
    model_name = models.CharField(max_length=255)
    model_description = models.TextField()
    model_version = models.DecimalField(max_digits=10, decimal_places=2)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=False)
    num_accepted_claims = models.IntegerField(default=0)
    num_rejected_claims = models.IntegerField(default=0)
    model_file = models.FileField(upload_to='models/', blank=True, null=True)  


    class Meta:
        db_table = 'Models'
        app_label = "Model_management"

class Prediction(models.Model):
    prediction_id = models.AutoField(primary_key=True)
    user_claim_id = models.IntegerField()

    class Meta:
        db_table = 'Predictions'

class UserModelFeedback(models.Model):
    feedback_id = models.AutoField(primary_key=True)
    user_id = models.IntegerField()
    settlement_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    expected_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    feedback_rating = models.SmallIntegerField(default=0)
    comments = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'UserModelFeedback'
        app_label = "Model_management"