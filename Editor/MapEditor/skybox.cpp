#include "skybox.h"
#include "systemskybox.h"
#include "object3dbox.h"
#include "rpm.h"

QString Skybox::SHADER_NAME = "sky";
QString Skybox::ATTR_MODEL_VIEW_PROJECTION = "modelviewProjection";
QString Skybox::ATTR_POS = "pos";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

Skybox::Skybox() :
    m_textureSkyBox(nullptr),
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
    delete m_textureSkyBox;
}

// -------------------------------------------------------

void Skybox::loadSkyBoxTexture(MapProperties *properties)
{
    SystemSkyBox *skyBox = reinterpret_cast<SystemSkyBox *>(SuperListItem::getById(RPM::get()
        ->project()->gameDatas()->systemDatas()->modelSkyBoxes()
        ->invisibleRootItem(), properties->skyboxID()->numberValue()));
    const QImage posz = this->createSkyBoxImage(skyBox->frontID()->id());
    const QImage negz = this->createSkyBoxImage(skyBox->backID()->id());
    const QImage posy = this->createSkyBoxImage(skyBox->topID()->id());
    const QImage negy = this->createSkyBoxImage(skyBox->bottomID()->id());
    const QImage posx = this->createSkyBoxImage(skyBox->rightID()->id());
    const QImage negx = this->createSkyBoxImage(skyBox->leftID()->id());
    QPainter painter;
    int size = posx.width();
    QImage image(size * 4, size * 3, QImage::Format_ARGB32);
    painter.begin(&image);
    painter.drawImage(size, 0, posy, 0, 0, size, size);
    painter.drawImage(size, size * 2, negy, 0, 0, size, size);
    painter.drawImage(0, size, posx, 0, 0, size, size);
    painter.drawImage(size * 2, size, negx, 0, 0, size, size);
    painter.drawImage(size, size, posz, 0, 0, size, size);
    painter.drawImage(size * 3, size, negz, 0, 0, size, size);
    painter.end();
    m_textureSkyBox = Map::createTexture(image);
}

// -------------------------------------------------------

QImage Skybox::createSkyBoxImage(int id)
{
    return QImage(reinterpret_cast<SystemPicture *>(SuperListItem::getById(RPM
        ::get()->project()->picturesDatas()->model(PictureKind::SkyBoxes)
        ->invisibleRootItem(), id))->getPath()).mirrored(true, false);
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

    // Vertices
    QVector3D vec;
    QVector2D tex;
    float s = 10000 * RPM::coefSquareSize();
    QVector<Vertex> vertices;
    for (int i = 0; i < Object3DBoxDatas::NB_VERTICES; i++) {
        tex = Object3DBoxDatas::TEXTURES[i];
        vec = Object3DBoxDatas::VERTICES_EQUAL[i] * s;
        vertices.append(Vertex(vec, QVector2D(Object3DBoxDatas::TEXTURES_VALUES[static_cast<int>(
            tex.x())], Object3DBoxDatas::TEXTURES_VALUES[static_cast<int>(tex.y())])));
    }
    // Indexes
    QVector<GLuint> indexes;
    for (int i = 0; i < Object3DBoxDatas::NB_INDEXES; i++) {
        indexes.append(Object3DBoxDatas::INDEXES[i]);
    }

    Map::updateGLStatic(m_vertexBufSkyBox, m_indexBufferSkyBox, vertices, indexes, m_vaoSkyBox, m_programSkyBox);
}

// -------------------------------------------------------

void Skybox::paintGL(QMatrix4x4 &modelviewProjection, float x, float y, float z)
{
    QVector3D pos(x, y, z);

    m_programSkyBox->bind();
    m_textureSkyBox->bind();

    m_programSkyBox->setUniformValue(u_modelViewProjection, modelviewProjection);
    m_programSkyBox->setUniformValue(u_pos, pos);
    m_vaoSkyBox.bind();
    glDrawElements(GL_TRIANGLES, Object3DBoxDatas::NB_INDEXES, GL_UNSIGNED_INT, nullptr);
    m_vaoSkyBox.release();

    m_textureSkyBox->release();
    m_programSkyBox->release();
}
