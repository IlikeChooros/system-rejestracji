# Generated by Django 3.2 on 2024-03-03 07:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='registry',
            name='email',
            field=models.EmailField(blank=True, max_length=254, null=True),
        ),
    ]
