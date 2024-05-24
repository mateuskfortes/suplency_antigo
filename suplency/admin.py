from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuario, Pomodoro, Materia, Pagina, FlashCard

admin.site.register(Usuario, UserAdmin)
admin.site.register(Pomodoro)
admin.site.register(Materia)
admin.site.register(Pagina)
admin.site.register(FlashCard)

