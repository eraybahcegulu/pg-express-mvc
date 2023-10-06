import express from 'express'
import postgresClient from '../config/db'
import path from 'path';
import session from 'express-session';
import authRoutes from './routes/auth/authRoutes';
import adminOrderRoutes from './routes/admin/viewsOrdersRoutes';
import productRoutes from './routes/admin/productRoutes';
import customerRoutes from './routes/admin/addCustomerRoutes';
import productTypeRoutes from './routes/admin/addProductTypeRoutes';
import customerHomeRoutes from './routes/customer/homeRoutes';
import adminHomeRoutes from './routes/admin/homeRoutes';
import customerCartRoutes from './routes/customer/cartRoutes';
import customerOrderRoutes from './routes/customer/orderRoutes';
//express, session gibi modülleri ve projemizin yönlendirme dosyalarını içe aktarıyoruz

const app = express()
const PORT = 5000;
//express uygulaması oluşturuluyor, port belirleniyor

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

declare module 'express-session' {
  interface SessionData {
    userId?: number;
    userEmail?: string;
    userName?: string;
    userType?: string;
  }
}
//express session ile oturum yönetimi
//müşterinin kendisine admin sayfalarına ulaşamaması (userType) vb. konularda oturum yönetimi önemli.

app.set('view engine', 'ejs');
//EJS görünüm motoru

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
//JSON ve URL verilerin işlenmesi içib Middleware lar

const ejsDirs = [
  path.join(__dirname, 'views/auth'),
  path.join(__dirname, 'views/admin'),
  path.join(__dirname, 'views/customer'),
];
app.set('views', ejsDirs);
//EJS dosyalarının bulunduğu dizinler

app.use('/', authRoutes);
app.use('/', adminOrderRoutes);
app.use('/', productRoutes);
app.use('/', customerRoutes);
app.use('/', productTypeRoutes);
app.use('/', customerHomeRoutes);
app.use('/', adminHomeRoutes);
app.use('/', customerCartRoutes);
app.use('/', customerOrderRoutes);
//yönlendirmeler

app.get('/', (req, res) => {
  res.render('login');
});
//login EJS dosyasını giriş sayfası olarak belirleme


app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
    }
    res.redirect('/');
  });
});
//oturum kapatmak için get /logout tanımlama


app.listen(PORT, () => {
  console.log(`server started http://localhost:${PORT}`);
  postgresClient.connect((err: Error) => {
    if (err) {
      console.log('Connection error', err.stack);
    } else {
      console.log('DB connection successful');
    }
  });
});
//uygulamanın çalışacağı port ve PostgreSQL ile bağlantı

//app.ts dosyası ile kullanıcının oturum yönetimi (yönetici-müşteri), projenin tüm yönlendirmeleri ve veritabanı bağlantısı sağlandı

/* 
package.json scripts ve tsconfig.json include ile projenin include ve build dosyaları ve dizini belirlendi, tüm projedeki dosyaların build olması sağlandı.
'npm run build' typescript dosyalarımızın js dosyasına çevrilip build klasörü oluşturulması sağlandı.
'npm run dev' build sonucu çıkan javascript dosyalarının çalıştırılması sağlandı.

Models dosyaları veritabanı işlemlerinin gerçekleştirildiği dosyalar. Projemizdeki tüm veritabanı işlemleri(ürün bilgilerini alma, kaydetme vb.) bu dosyalarda gerçekleştirilmesi sağlandı.
Tüm models dosyalarının PostgreSQL ile etkileşimi sağlandı(config/Db.ts)

Controller dosyaları ile metodlar tanımlandı. Tüm metodlarda admin ve müşteri kontrolü yapıldı ve gerekli oturum yönlendirmeleri yapıldı.
Controller metodları ile belirlenmiş Models dosyalarındaki sınıfların aracılığıyla işlemler gerçekleştirildi.

Routes dosyaları ile GET ve POST istekleri tanımlandı.
Bu GET ve SET istekler ile kendi Controller sınıfından metodların çağırılması sağlandı ve Viewsler aralığıyla bu fonksiyonlar gerçekleştirilip kullanıcıya gösterildi.(sayfayı renderlama, ürün silme vb.)

Views, kullanıcı arayüzü. (kullanıcı etkileşimlerinin controller dosyalarına aktarılması)
(Views > Routes > Controller)
EJS kullanıldı. Veritabanındaki tüm bilgileri kullanıcıya göstermek amacıyla EJS döngüleri sıkça kullanıldı.
Örneğin veritabanındaki her verinin veya belirli koşullardaki verilerin kullanıcıya gösterilmesi sağlandı(müşteri sepetindeki ürünler, siparişlerim, admine özel sayfalardaki müşteriler tablosu verileri, ürün düzenleme-silme tablolarındaki verileri gösterme vb.)

Kullanıcı arayüzünde fonksiyonlar sonucu gerekli geri bildirimlerin verilmesi sağlandı.(ürün düzenlendi, ürün sepete eklendi, sparişim silindi, siparişin oluşturuldu vb.)

Projenin Views katmanında Bootstrap kullanıldı.

Kullanılan teknolojiler
-TypeScript
-NodeJS
-ExpressJS
-PostgreSQL
-GitHub
-Bootstrap
-Postman ile GET SET istekleri
*/