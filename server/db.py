import mysql.connector
from pprint import pprint


class Database:

    def __init__(self):
        self.create_pool()

    def create_pool(self):
        dbconfig = {
            'host': 'academic-mysql.cc.gatech.edu',
            'user': 'cs4400_Team_78',
            'password': '5y5oy2MS',
            'database': 'cs4400_Team_78'
        }
        self.pool = mysql.connector.pooling.MySQLConnectionPool(
            pool_name="mypool", pool_size=10, **dbconfig)

    def query(self, sql, params=None, multi=False):
        connection = self.pool.get_connection()
        cursor = connection.cursor(dictionary=True)
        pprint(params)
        result = None
        if multi:
            for line in cursor.execute(sql, params, multi=True):
                if line.with_rows:
                    result = line.fetchall()
            if result is None:
                result = {'success': True}

        else:
            cursor.execute(sql, params)
            try:
                result = cursor.fetchall()
            except:
                result = {
                    'affected_rows': cursor.rowcount
                }
        cursor.close()
        connection.commit()
        connection.close()
        return result
