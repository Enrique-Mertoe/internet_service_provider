import unittest

import requests

from mtk.services import Mtk, MtkResponseObject, MtkPayload

# Mtk.init(host="http://127.0.0.1:5001")


# class MTKTests(unittest.TestCase):
#     def test_provision_success(self):
#         res: MtkResponseObject[MtkPayload] = Mtk.provision("MTK12")
#         if res.error:
#             self.assertFalse(res.success)
#             self.assertNotIsInstance(res.payload, MtkPayload)
#             self.assertNotIn("created successfully", res.message or "")
#         else:
#             self.assertTrue(res.success)
#             self.assertIsInstance(res.payload, MtkPayload)
#             self.assertEqual(res.payload.client_name, "MTK1")
#             self.assertTrue(res.payload.certificate_created)
#             self.assertTrue(res.payload.config_file_available)
#             self.assertIsNotNone(res.payload.created_at)
#             self.assertIn("created successfully", res.message or "")
#
#
#     def test_provision_failure(self):
#         res: MtkResponseObject[None] = Mtk.provision("")
#         self.assertFalse(res.success)
#         self.assertIsNone(res.payload)
#         self.assertIsNotNone(res.error)


# res = requests.get("http://127.0.0.1:5001/api/mikrotik/devices/MTK12/config", headers={"x-api-key": "your-django-api-key-for-authentication"})
# print(res.text)
# if __name__ == '__main__':
    # unittest.main()
