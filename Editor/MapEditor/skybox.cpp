#include "skybox.h"
#include "systemskybox.h"
#include "rpm.h"

QVector<QVector3D> Skybox::VERTICES_SKYBOX =
{
    {-1.0f,  1.0f, -1.0f},
    {-1.0f, -1.0f, -1.0f},
    {+1.0f, -1.0f, -1.0f},
    {+1.0f, +1.0f, -1.0f},

    {-1.0f, -1.0f, +1.0f},
    {-1.0f, -1.0f, -1.0f},
    {-1.0f, +1.0f, -1.0f},
    {-1.0f, +1.0f, +1.0f},

    {+1.0f, -1.0f, -1.0f},
    {+1.0f, -1.0f, +1.0f},
    {+1.0f, +1.0f, +1.0f},
    {+1.0f, +1.0f, -1.0f},

    {-1.0f, -1.0f, +1.0f},
    {-1.0f, +1.0f, +1.0f},
    {+1.0f, +1.0f, +1.0f},
    {+1.0f, -1.0f, +1.0f},

    {-1.0f, +1.0f, -1.0f},
    {+1.0f, +1.0f, -1.0f},
    {+1.0f, +1.0f, +1.0f},
    {-1.0f, +1.0f, +1.0f},

    {-1.0f, -1.0f, -1.0f},
    {-1.0f, -1.0f, +1.0f},
    {+1.0f, -1.0f, -1.0f},
    {+1.0f, -1.0f, +1.0f}
};

QVector<GLuint> Skybox::INDEXES_SKYBOX = QVector<GLuint>({
    0, 1, 2, 2, 3, 0,
    4, 5, 6, 6, 7, 4,
    8, 9, 10, 10, 11, 8,
    12, 13, 14, 14, 15, 12,
    16, 17, 18, 18, 19, 16,
    20, 21, 22, 22, 21, 23
});

QString Skybox::SHADER_NAME = "sky";
QString Skybox::ATTR_MODEL_VIEW_PROJECTION = "modelviewProjection";
QString Skybox::ATTR_POS = "pos";
QString Skybox::ATTR_SIZE = "size";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

Skybox::Skybox() :
    m_textureSkyBox(QOpenGLTexture::TargetCubeMap),
    m_vertexBufSkyBox(QOpenGLBuffer::VertexBuffer),
    m_indexBufferSkyBox(QOpenGLBuffer::IndexBuffer)
{

}

Skybox::~Skybox()
{
    if (m_programSkyBox != nullptr)
    {
        delete m_programSkyBox;
    }
}

// -------------------------------------------------------

void Skybox::loadSkyBoxTexture(MapProperties *properties)
{
    SystemSkyBox *skyBox;

    skyBox = reinterpret_cast<SystemSkyBox *>(SuperListItem::getById(RPM::get()
        ->project()->gameDatas()->systemDatas()->modelSkyBoxes()
        ->invisibleRootItem(), properties->skyboxID()->numberValue()));
    const QImage posz = this->createSkyBoxImage(skyBox->frontID()->id())
        .mirrored(true, false);
    const QImage negz = this->createSkyBoxImage(skyBox->backID()->id())
        .mirrored(true, false);
    const QImage posy = this->createSkyBoxImage(skyBox->topID()->id())
        .mirrored(true, false);
    const QImage negy = this->createSkyBoxImage(skyBox->bottomID()->id())
        .mirrored(true, false);
    const QImage posx = this->createSkyBoxImage(skyBox->leftID()->id())
        .mirrored(true, false);
    const QImage negx = this->createSkyBoxImage(skyBox->rightID()->id())
        .mirrored(true, false);

    m_textureSkyBox.destroy();
    m_textureSkyBox.create();
    m_textureSkyBox.setSize(posx.width(), posx.height(), posx.depth());
    m_textureSkyBox.setFormat(QOpenGLTexture::RGBA8_UNorm);
    m_textureSkyBox.allocateStorage();

    m_textureSkyBox.setData(0, 0, QOpenGLTexture::CubeMapPositiveX,
                     QOpenGLTexture::RGBA, QOpenGLTexture::UInt8,
                     posx.constBits(), Q_NULLPTR);

    m_textureSkyBox.setData(0, 0, QOpenGLTexture::CubeMapPositiveY,
                     QOpenGLTexture::RGBA, QOpenGLTexture::UInt8,
                     posy.constBits(), Q_NULLPTR);

    m_textureSkyBox.setData(0, 0, QOpenGLTexture::CubeMapPositiveZ,
                     QOpenGLTexture::RGBA, QOpenGLTexture::UInt8,
                     posz.constBits(), Q_NULLPTR);

    m_textureSkyBox.setData(0, 0, QOpenGLTexture::CubeMapNegativeX,
                     QOpenGLTexture::RGBA, QOpenGLTexture::UInt8,
                     negx.constBits(), Q_NULLPTR);

    m_textureSkyBox.setData(0, 0, QOpenGLTexture::CubeMapNegativeY,
                     QOpenGLTexture::RGBA, QOpenGLTexture::UInt8,
                     negy.constBits(), Q_NULLPTR);

    m_textureSkyBox.setData(0, 0, QOpenGLTexture::CubeMapNegativeZ,
                     QOpenGLTexture::RGBA, QOpenGLTexture::UInt8,
                     negz.constBits(), Q_NULLPTR);

    m_textureSkyBox.setWrapMode(QOpenGLTexture::ClampToEdge);
    m_textureSkyBox.setMinificationFilter(QOpenGLTexture::Filter::Nearest);
    m_textureSkyBox.setMagnificationFilter(QOpenGLTexture::Filter::Nearest);
}

// -------------------------------------------------------

QImage Skybox::createSkyBoxImage(int id)
{
    return QImage(reinterpret_cast<SystemPicture *>(SuperListItem::getById(RPM
        ::get()->project()->picturesDatas()->model(PictureKind::SkyBoxes)
        ->invisibleRootItem(), id))->getPath(PictureKind::SkyBoxes))
        .convertToFormat(QImage::Format_RGBA8888);
}

// -------------------------------------------------------

void Skybox::initializeGL()
{
    initializeOpenGLFunctions();

    // Create program
    m_programSkyBox = Map::createProgram(SHADER_NAME);

    // Uniform locations
    u_modelViewProjection = m_programSkyBox->uniformLocation(
        ATTR_MODEL_VIEW_PROJECTION);
    u_pos = m_programSkyBox->uniformLocation(ATTR_POS);
    u_size = m_programSkyBox->uniformLocation(ATTR_SIZE);

    // If existing VAO or VBO, destroy it
    if (m_vaoSkyBox.isCreated())
    {
        m_vaoSkyBox.destroy();
    }
    if (m_vertexBufSkyBox.isCreated())
    {
        m_vertexBufSkyBox.destroy();
    }
    if (m_indexBufferSkyBox.isCreated())
    {
        m_indexBufferSkyBox.destroy();
    }

    // Create new VBO for vertex
    m_vertexBufSkyBox.create();
    m_vertexBufSkyBox.bind();
    m_vertexBufSkyBox.setUsagePattern(QOpenGLBuffer::StaticDraw);
    m_vertexBufSkyBox.allocate(VERTICES_SKYBOX.constData(), static_cast<int>(
        static_cast<unsigned long>(VERTICES_SKYBOX.size()) * sizeof(QVector3D)));

    // Create new VBO for indexes
    m_indexBufferSkyBox.create();
    m_indexBufferSkyBox.bind();
    m_indexBufferSkyBox.setUsagePattern(QOpenGLBuffer::StaticDraw);
    m_indexBufferSkyBox.allocate(INDEXES_SKYBOX.constData(), static_cast<int>(
        static_cast<unsigned long>(INDEXES_SKYBOX.size()) * sizeof(GLuint)));

    // Create new VAO
    m_vaoSkyBox.create();
    m_vaoSkyBox.bind();
    m_programSkyBox->enableAttributeArray(0);
    m_programSkyBox->setAttributeBuffer(0, GL_FLOAT, 0, 3, sizeof(QVector3D));
    m_indexBufferSkyBox.bind();

    // Releases
    m_vaoSkyBox.release();
    m_indexBufferSkyBox.release();
    m_vertexBufSkyBox.release();
    m_programSkyBox->release();
}

// -------------------------------------------------------

void Skybox::paintGL(QMatrix4x4 &modelviewProjection, float x, float y, float z)
{
    float s = ((RPM::get()->getPortionsRay() * 2) + 1) * RPM::getSquareSize();
    s = 4000;
    QVector3D pos(x, y, z);
    QVector3D size(s, s, s);

    m_programSkyBox->bind();
    m_textureSkyBox.bind();

    m_programSkyBox->setUniformValue(u_modelViewProjection, modelviewProjection);
    m_programSkyBox->setUniformValue(u_pos, pos);
    m_programSkyBox->setUniformValue(u_size, size);
    m_vaoSkyBox.bind();
    glDrawElements(GL_TRIANGLES, INDEXES_SKYBOX.size(), GL_UNSIGNED_INT, nullptr);
    m_vaoSkyBox.release();

    m_textureSkyBox.release();
    m_programSkyBox->release();
}
