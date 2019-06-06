/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#include "autotiles.h"
#include "rpm.h"

QHash<QString, int> Autotiles::initializeAutotileBorder() {
    QHash<QString, int> hash;

    hash.insert("A1", 2);
    hash.insert("B1", 3);
    hash.insert("C1", 6);
    hash.insert("D1", 7);
    hash.insert("A2", 8);
    hash.insert("B4", 9);
    hash.insert("A4", 10);
    hash.insert("B2", 11);
    hash.insert("C5", 12);
    hash.insert("D3", 13);
    hash.insert("C3", 14);
    hash.insert("D5", 15);
    hash.insert("A5", 16);
    hash.insert("B3", 17);
    hash.insert("A3", 18);
    hash.insert("B5", 19);
    hash.insert("C2", 20);
    hash.insert("D4", 21);
    hash.insert("C4", 22);
    hash.insert("D2", 23);

    return hash;
}

QHash<QString, int> Autotiles::autotileBorder = initializeAutotileBorder();
const int Autotiles::COUNT_LIST = 5;
QString Autotiles::listA[COUNT_LIST] {"A1", "A2", "A3", "A4", "A5"};
QString Autotiles::listB[COUNT_LIST] {"B1", "B2", "B3", "B4", "B5"};
QString Autotiles::listC[COUNT_LIST] {"C1", "C2", "C3", "C4", "C5"};
QString Autotiles::listD[COUNT_LIST] {"D1", "D2", "D3", "D4", "D5"};

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

Autotiles::Autotiles() :
    m_isEmpty(true)
{

}

Autotiles::~Autotiles()
{
    QHash<Position, AutotileDatas*>::iterator i;
    for (i = m_all.begin(); i != m_all.end(); i++)
        delete i.value();

    clearAutotilesGL();
}

bool Autotiles::isEmpty() const {
    return m_isEmpty;
}

void Autotiles::updateEmpty(bool previewSquare) {
    m_isEmpty = m_all.isEmpty() && previewSquare;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void Autotiles::clearAutotilesGL() {
    for (int i = 0; i < m_autotilesGL.size(); i++)
        delete m_autotilesGL.at(i);
    m_autotilesGL.clear();
}

// -------------------------------------------------------

AutotileDatas* Autotiles::getAutotile(Position& p) const {
    return m_all.value(p);
}

// -------------------------------------------------------

void Autotiles::setAutotile(Position& p, AutotileDatas* autotile) {
    m_all.insert(p, autotile);
}

// -------------------------------------------------------

AutotileDatas* Autotiles::removeAutotile(Position& p) {
    AutotileDatas* autotile = m_all.value(p);

    if (autotile != nullptr)
        m_all.remove(p);

    return autotile;
}

// -------------------------------------------------------

void Autotiles::removeAutotileOut(MapProperties& properties) {
    QList<Position> list;
    QHash<Position, AutotileDatas*>::iterator i;
    for (i = m_all.begin(); i != m_all.end(); i++) {
        Position position = i.key();

        if (position.isOutMapPorperties(properties)) {
            delete *i;
            list.push_back(position);
        }
    }

    for (int j = 0; j < list.size(); j++)
        m_all.remove(list.at(j));
}

// -------------------------------------------------------

MapElement *Autotiles::updateRaycasting(int squareSize, float& finalDistance,
    Position &finalPosition, QRay3D &ray, Position &previousCoords)
{
    MapElement* element = nullptr;

    for (QHash<Position, AutotileDatas*>::iterator i = m_all.begin();
         i != m_all.end(); i++)
    {
        Position position = i.key();
        AutotileDatas* autotile = i.value();
        if (updateRaycastingAt(position, autotile, squareSize, finalDistance,
            finalPosition, ray, previousCoords))
        {
            element = autotile;
        }
    }

    return element;
}

// -------------------------------------------------------

bool Autotiles::updateRaycastingAt(Position &position, AutotileDatas *autotile,
    int squareSize, float &finalDistance, Position &finalPosition, QRay3D& ray,
    Position &previousCoords)
{
    // Check if autotile is in current drawing height
    if (previousCoords.x() == -500 || (previousCoords.y() == position.y() &&
        qFuzzyCompare(previousCoords.yPlus(), position.yPlus())))
    {
        float newDistance = autotile->intersection(squareSize, ray, position);
        if (RPM::getMinDistance(finalDistance, newDistance)) {
            finalPosition = position;
            return true;
        }
    }

    return false;
}

// -------------------------------------------------------

void Autotiles::getAutotilesWithPreview(
        QHash<Position, AutotileDatas*> &autotilesWithPreview,
        QHash<Position, MapElement*> &preview)
{
    autotilesWithPreview = m_all;
    QHash<Position, MapElement*>::iterator itw;
    for (itw = preview.begin(); itw != preview.end(); itw++) {
        MapElement* element = itw.value();
        if (element->getSubKind() == MapEditorSubSelectionKind::Floors)
            autotilesWithPreview.remove(itw.key());
        else if (element->getSubKind() == MapEditorSubSelectionKind::Autotiles)
            autotilesWithPreview[itw.key()] = (AutotileDatas*) element;
    }
}

// -------------------------------------------------------

AutotileDatas* Autotiles::tileExisting(Position& position, Portion& portion,
                                       QHash<Position, AutotileDatas*> &preview)
{
    Portion newPortion;
    RPM::get()->project()->currentMap()->getLocalPortion(position,
                                                           newPortion);
    if (portion == newPortion)
        return (AutotileDatas*) preview.value(position);
    else { // If out of current portion
        MapPortion* mapPortion = RPM::get()->project()->currentMap()
                ->mapPortion(newPortion);

        return (mapPortion == nullptr) ? nullptr : (AutotileDatas*) mapPortion
            ->getMapElementAt(position, MapEditorSelectionKind::Land,
                              MapEditorSubSelectionKind::Autotiles);
    }
}

// -------------------------------------------------------

AutotileDatas* Autotiles::tileOnWhatever(
        Position& position, Portion &portion, int id, QRect& rect,
        QHash<Position, AutotileDatas*> &preview)
{
    AutotileDatas* autotile = tileExisting(position, portion, preview);

    return (autotile != nullptr && autotile->autotileID() == id &&
            (*autotile->textureRect()) == rect) ? autotile : nullptr;
}

// -------------------------------------------------------

bool Autotiles::tileOnLeft(Position& position, Portion& portion, int id,
                           QRect& rect,
                           QHash<Position, AutotileDatas*> &preview)
{
    Position newPosition(position.x() - 1, position.y(), position.yPlus(),
                         position.z(), position.layer());
    return tileOnWhatever(newPosition, portion, id, rect, preview) != nullptr;
}

// -------------------------------------------------------

bool Autotiles::tileOnRight(Position& position, Portion& portion, int id,
                            QRect& rect,
                            QHash<Position, AutotileDatas*> &preview)
{
    Position newPosition(position.x() + 1, position.y(), position.yPlus(),
                         position.z(), position.layer());
    return tileOnWhatever(newPosition, portion, id, rect, preview) != nullptr;
}

// -------------------------------------------------------

bool Autotiles::tileOnTop(Position& position, Portion& portion, int id,
                          QRect& rect,
                          QHash<Position, AutotileDatas*> &preview)
{
    Position newPosition(position.x(), position.y(), position.yPlus(),
                         position.z() - 1, position.layer());
    return tileOnWhatever(newPosition, portion, id, rect, preview) != nullptr;
}

// -------------------------------------------------------

bool Autotiles::tileOnBottom(Position& position, Portion& portion, int id,
                             QRect& rect,
                             QHash<Position, AutotileDatas*> &preview)
{
    Position newPosition(position.x(), position.y(), position.yPlus(),
                         position.z() + 1, position.layer());
    return tileOnWhatever(newPosition, portion, id, rect, preview) != nullptr;
}

// -------------------------------------------------------

bool Autotiles::tileOnTopLeft(Position& position, Portion& portion, int id,
                              QRect& rect,
                              QHash<Position, AutotileDatas*> &preview)
{
    Position newPosition(position.x() - 1, position.y(), position.yPlus(),
                         position.z() - 1, position.layer());
    return tileOnWhatever(newPosition, portion, id, rect, preview) != nullptr;
}

// -------------------------------------------------------

bool Autotiles::tileOnTopRight(Position& position, Portion& portion, int id,
                               QRect& rect,
                               QHash<Position, AutotileDatas*> &preview)
{
    Position newPosition(position.x() + 1, position.y(), position.yPlus(),
                         position.z() - 1, position.layer());
    return tileOnWhatever(newPosition, portion, id, rect, preview) != nullptr;
}

// -------------------------------------------------------

bool Autotiles::tileOnBottomLeft(Position& position, Portion& portion, int id,
                                 QRect& rect,
                                 QHash<Position, AutotileDatas*> &preview)
{
    Position newPosition(position.x() - 1, position.y(), position.yPlus(),
                         position.z() + 1, position.layer());
    return tileOnWhatever(newPosition, portion, id, rect, preview) != nullptr;
}

// -------------------------------------------------------

bool Autotiles::tileOnBottomRight(Position& position, Portion& portion, int id,
                                  QRect& rect,
                                  QHash<Position, AutotileDatas*> &preview)
{
    Position newPosition(position.x() + 1, position.y(), position.yPlus(),
                         position.z() + 1, position.layer());
    return tileOnWhatever(newPosition, portion, id, rect, preview) != nullptr;
}

// -------------------------------------------------------

void Autotiles::updateAround(Position& position,
                             QHash<Position, AutotileDatas *> &autotiles,
                             QSet<MapPortion*>& update, QSet<MapPortion*>& save,
                             QSet<MapPortion *> *previousPreview)
{
    Portion portion;
    RPM::get()->project()->currentMap()->getLocalPortion(position, portion);
    for (int i = -1; i <= 1; i++) {
        for (int j = -1; j <= 1; j++) {
            Position newPosition(position.x() + i, position.y(),
                                 position.yPlus(), position.z() + j,
                                 position.layer());
            AutotileDatas* newAutotile = tileExisting(newPosition, portion,
                                                      autotiles);
            if (newAutotile != nullptr) {

                // Update the current autotile
                AutotileDatas* previewAutotile = nullptr;
                bool changed;
                if (previousPreview == nullptr)
                    changed = newAutotile->update(newPosition, portion,
                                                  autotiles);
                else {
                    bool center = (i == 0 && j == 0);
                    if (center)
                        previewAutotile = newAutotile;
                    else
                        previewAutotile = new AutotileDatas(*newAutotile);
                    changed = previewAutotile->update(newPosition, portion,
                                                      autotiles);
                    if (!changed && !center)
                        delete previewAutotile;
                }

                if (changed) {
                    Portion newPortion;
                    RPM::get()->project()->currentMap()->getLocalPortion(
                                newPosition, newPortion);

                    // Update view in different portion
                    if (portion != newPortion) {
                        MapPortion* mapPortion = RPM::get()->project()
                                ->currentMap()->mapPortion(newPortion);
                        update += mapPortion;
                        if (previousPreview == nullptr)
                            save += mapPortion;
                        else
                            *previousPreview += mapPortion;
                    }

                    // If preview, add the autotile to it
                    if (previousPreview != nullptr) {
                        RPM::get()->project()->currentMap()
                                ->mapPortion(newPortion)
                                ->addPreview(newPosition, previewAutotile);
                    }
                }
            }
        }
    }
}

// -------------------------------------------------------

void Autotiles::updateWithoutPreview(Position& position,
                                     QSet<MapPortion *> &update,
                                     QSet<MapPortion *> &save)
{
    updateAround(position, m_all, update, save, nullptr);
}

// -------------------------------------------------------
//
//  GL
//
// -------------------------------------------------------

void Autotiles::initializeVertices(QList<TextureAutotile*> &texturesAutotiles,
                                   QHash<Position, MapElement*>& previewSquares,
                                   int squareSize)
{
    clearAutotilesGL();
    for (int j = 0; j < texturesAutotiles.size(); j++)
        m_autotilesGL.append(new Autotile);

    // Create temp hash for preview
    QHash<Position, AutotileDatas*> autotilesWithPreview;
    getAutotilesWithPreview(autotilesWithPreview, previewSquares);

    // Initialize vertices for walls
    QHash<Position, AutotileDatas*>::iterator i;
    for (i = autotilesWithPreview.begin(); i != autotilesWithPreview.end(); i++)
    {
        Position position = i.key();
        AutotileDatas* autotile = i.value();
        TextureAutotile* texture = nullptr;
        int index = 0;
        for (; index < texturesAutotiles.size(); index++) {
            TextureAutotile* textureAutotile = texturesAutotiles[index];
            if (textureAutotile->isInTexture(autotile->autotileID(),
                                             autotile->textureRect()))
            {
                texture = textureAutotile;
                break;
            }
        }
        if (texture != nullptr && texture->texture() != nullptr) {
            Autotile* autotileGL = m_autotilesGL.at(index);
            autotileGL->initializeVertices(texture, position, autotile,
                                           squareSize,
                                           texture->texture()->width(),
                                           texture->texture()->height());
        }
    }
}

// -------------------------------------------------------

void Autotiles::initializeGL(QOpenGLShaderProgram *program){
    for (int i = 0; i < m_autotilesGL.size(); i++)
        m_autotilesGL.at(i)->initializeGL(program);
}

// -------------------------------------------------------

void Autotiles::updateGL(){
    for (int i = 0; i < m_autotilesGL.size(); i++)
        m_autotilesGL.at(i)->updateGL();
}

// -------------------------------------------------------

void Autotiles::paintGL(int textureID){
    m_autotilesGL.at(textureID)->paintGL();
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void Autotiles::read(const QJsonObject & json){
    QJsonArray tab = json["autotiles"].toArray();

    for (int i = 0; i < tab.size(); i++){
        QJsonObject obj = tab.at(i).toObject();
        Position p;
        p.read(obj["k"].toArray());
        QJsonObject objLand = obj["v"].toObject();
        AutotileDatas* autotile = new AutotileDatas;
        autotile->read(objLand);
        m_all[p] = autotile;
    }
}

// -------------------------------------------------------

void Autotiles::write(QJsonObject & json) const{
    QJsonArray tab;

    QHash<Position, AutotileDatas*>::const_iterator i;
    for (i = m_all.begin(); i != m_all.end(); i++){
        QJsonObject objHash;
        QJsonArray tabKey;
        Position position = i.key();
        position.write(tabKey);
        AutotileDatas* autotile = i.value();
        QJsonObject obj;
        autotile->write(obj);
        objHash["k"] = tabKey;
        objHash["v"] = obj;
        tab.append(objHash);
    }
    json["autotiles"] = tab;
}
