# Generated by Django 5.0.4 on 2024-07-20 16:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('suplency', '0003_alter_pagina_options_remove_usuario_ultima_materia_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='materia',
            name='cor_da_materia',
            field=models.CharField(max_length=32),
        ),
        migrations.AlterField(
            model_name='materia',
            name='nome_da_materia',
            field=models.CharField(max_length=32),
        ),
    ]
