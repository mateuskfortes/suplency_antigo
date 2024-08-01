from django.test import TestCase, Client
from django.urls import reverse
from .models import Caderno, Usuario, Pagina, Materia
import json

class CadernoViewNewUser(TestCase):
    def setUp(self):
        self.username = 'teste'
        self.password = 'parafuso'
        self.usuario = Usuario.objects.create_user(username=self.username, password=self.password)
        
        self.cliente = Client()
        
    def test_create_caderno(self):
        self.cliente.login(username=self.username, password=self.password)
        
        response = self.cliente.get(reverse('caderno'))
        
        self.assertEqual(response.status_code, 201)
        
        caderno = Caderno.objects.filter(usuario=self.usuario).first()
        self.assertEqual(caderno.usuario, self.usuario)
        materia = Materia.objects.filter(caderno=caderno).first()
        self.assertEqual(materia.caderno, caderno)
        pagina = Pagina.objects.filter(materia=materia).first()
        self.assertEqual(pagina.materia, materia)
        self.assertEqual(pagina.numero, 0)
        
    def test_caderno_view_unauthenticated(self):
        response = self.cliente.get(reverse('caderno'))
        
        self.assertEqual(response.status_code, 200)
        
        response_data = json.loads(response.content)
        self.assertEqual(response_data['ultima_materia'], '-1')
        self.assertIn('-1', response_data['materias'])
        self.assertEqual(response_data['materias']['-1']['nome'], 'Nova matéria')
        self.assertEqual(response_data['materias']['-1']['ultima_pagina'], 0)
        self.assertEqual(response_data['materias']['-1']['paginas'][0]['conteudo'], '<p><br></p>')

class CadernoViewAuthenticated(TestCase):
    def setUp(self):
        self.url_view = reverse('caderno')
        self.url_save = reverse('salvar_caderno')
        
        self.username = 'teste'
        self.password = 'parafuso'
        self.usuario = Usuario.objects.create_user(username=self.username, password=self.password)
        
        self.caderno = Caderno.objects.create(usuario=self.usuario)
        self.materia1 = Materia.objects.create(caderno=self.caderno)
        self.materia2 = Materia.objects.create(caderno=self.caderno)
        self.pagina11 = Pagina.objects.create(materia=self.materia1, numero=0)
        self.pagina21 = Pagina.objects.create(materia=self.materia2, numero=0)
        self.pagina22 = Pagina.objects.create(materia=self.materia2, numero=1)
        
        self.caderno.ultima_materia = self.materia1
        self.caderno.save()
        self.materia1.ultima_pagina = self.pagina11
        self.materia1.save()
        self.materia2.ultima_pagina = self.pagina22
        self.materia2.save()
        
        self.cliente = Client()
        self.cliente.login(username=self.username, password=self.password)
            
    def test_load_caderno(self):
        response = self.cliente.get(self.url_view)
        
        data = json.loads(response.content)
        self.assertEqual(data['ultima_materia'], str(self.materia1.id))
        data_materias = data['materias']
        data_materia1 = data_materias[str(self.materia1.id)]
        data_paginas_materia1 = data_materia1['paginas']
        data_materia2 = data_materias[str(self.materia2.id)]
        data_paginas_materia2 = data_materia2['paginas']
        
        self.assertEqual(len(data_materias.keys()), 2)
        self.assertIn(str(self.materia1.id), data_materias.keys())
        self.assertIn(str(self.materia2.id), data_materias.keys())
        
        self.assertEqual(data_materia1['nome'], self.materia1.nome)
        self.assertEqual(data_materia1['ultima_pagina'], self.materia1.ultima_pagina.numero)
        
        self.assertEqual(len(data_paginas_materia1), 1)
        self.assertEqual(data_paginas_materia1[0]['id'], str(self.pagina11.id))
        self.assertEqual(data_paginas_materia1[0]['conteudo'], self.pagina11.conteudo)
        
        self.assertEqual(data_materia2['nome'], self.materia2.nome)
        self.assertEqual(data_materia2['ultima_pagina'], self.materia2.ultima_pagina.numero)
        
        self.assertEqual(len(data_paginas_materia2), 2)
        self.assertEqual(data_paginas_materia2[0]['id'], str(self.pagina21.id))
        self.assertEqual(data_paginas_materia2[0]['conteudo'], self.pagina21.conteudo)
        self.assertEqual(data_paginas_materia2[1]['id'], str(self.pagina22.id))
        self.assertEqual(data_paginas_materia2[1]['conteudo'], self.pagina22.conteudo)
        
    def test_save_caderno(self):
        materia1_nome_alterado = 'nome mudado'
        pagina11_texto_alterado = '<p>texto alterado</p>'
        pagina12_texto = '<p>texto novo</p>'
        nova_materia_nome = 'nome nova materia'
        nova_materia_pagina1_texto = "<p>oi</p>"
        nova_materia_pagina2_texto = "<p>tchau</p>"
        
        save_data = {
            "ultima_materia": "-1",
            "materias": {
                str(self.materia1.id): {
                    "nome": materia1_nome_alterado,
                    "ultima_pagina": 1,
                    "paginas": [
                        {
                            'id': str(self.pagina11.id),
                            'conteudo': pagina11_texto_alterado
                        },
                        {
                            'id': '-1',
                            'posicao': 1,
                            'conteudo': pagina12_texto
                        }
                    ]
                },
                "-1": {
                    "nome": nova_materia_nome,
                    "ultima_pagina": 1,
                    "paginas": [
                        {
                            "id": '-1',
                            "posicao": 0,
                            "conteudo": nova_materia_pagina2_texto
                        },
                        {
                            "id": '-2',
                            "posicao": 0,
                            "conteudo": nova_materia_pagina1_texto
                        }
                    ]
                }
            }
        }
        
        response = self.cliente.post(self.url_save, json.dumps(save_data), content_type='application/json')
        
        caderno_test = Caderno.objects.get(usuario=self.usuario)
        
        
        materias_test = Materia.objects.filter(caderno=caderno_test)
        
        self.assertEqual(len(materias_test), 3)
        
        materia1_test = materias_test.get(id=self.materia1.id)
        
        self.assertEqual(materia1_test.nome, materia1_nome_alterado)
        self.assertEqual(materia1_test.ultima_pagina.numero, 1)
        
        paginas_materia1_test = Pagina.objects.filter(materia=materia1_test)
        
        self.assertEqual(len(paginas_materia1_test), 2) 
        
        pagina11_test = paginas_materia1_test.get(id=self.pagina11.id)
        pagina12_test = paginas_materia1_test.exclude(id__in=[self.pagina11.id]).first()
        
        self.assertEqual(pagina11_test.conteudo, pagina11_texto_alterado)
        self.assertEqual(pagina12_test.conteudo, pagina12_texto)
        
        nova_materia_test = materias_test.exclude(id__in=[self.materia1.id, self.materia2.id]).first()
        
        self.assertEqual(caderno_test.ultima_materia, nova_materia_test)
        self.assertEqual(nova_materia_test.nome, nova_materia_nome)
        self.assertEqual(nova_materia_test.ultima_pagina.numero, 1)
        
        paginas_nova_materia_test = Pagina.objects.filter(materia=nova_materia_test)
        
        self.assertEqual([p.numero for p in paginas_nova_materia_test], [0, 1])
        
        nova_materia_pagina_1_test = paginas_nova_materia_test.get(numero=0)
        nova_materia_pagina_2_test = paginas_nova_materia_test.get(numero=1)
        
        self.assertEqual(nova_materia_pagina_1_test.conteudo, nova_materia_pagina1_texto)
        self.assertEqual(nova_materia_pagina_2_test.conteudo, nova_materia_pagina2_texto)
        