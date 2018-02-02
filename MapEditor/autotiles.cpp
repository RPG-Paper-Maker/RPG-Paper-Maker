/*
    RPG Paper Maker Copyright (C) 2017 Marie Laporte

    This file is part of RPG Paper Maker.

    RPG Paper Maker is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RPG Paper Maker is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

#include "autotiles.h"
#include "wanok.h"

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

Autotiles::Autotiles()
{

}

Autotiles::~Autotiles()
{
    QHash<Position, AutotileDatas*>::iterator i;
    for (i = m_all.begin(); i != m_all.end(); i++)
        delete i.value();

    clearAutotilesGL();
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

bool Autotiles::isEmpty() const {
    return true;
}

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

bool Autotiles::addAutotile(Position& p, AutotileDatas* autotile,
                            QJsonObject &previousObj,
                            MapEditorSubSelectionKind& previousType,
                            QSet<MapPortion*>& update, QSet<MapPortion*>& save)
{
    AutotileDatas* previousAutotile = removeAutotile(p);
    bool changed = true;

    if (previousAutotile != nullptr) {
        previousAutotile->write(previousObj);
        previousType = previousAutotile->getSubKind();
        changed = (*previousAutotile) != (*autotile);
        delete previousAutotile;
    }

    setAutotile(p, autotile);
    updateAround(p, m_all, update, save, nullptr);

    return changed;
}

// -------------------------------------------------------

bool Autotiles::deleteAutotile(Position& p, QJsonObject &previous,
                               MapEditorSubSelectionKind &previousType,
                               QSet<MapPortion*> &update,
                               QSet<MapPortion*> &save)
{
    AutotileDatas* previousAutotile = removeAutotile(p);
    bool changed = false;

    if (previousAutotile != nullptr) {
        previousAutotile->write(previous);
        previousType = previousAutotile->getSubKind();
        changed = true;

        delete previousAutotile;
    }

    updateAround(p, m_all, update, save, nullptr);

    return changed;
}

// -------------------------------------------------------

void Autotiles::removeAutotileOut(MapProperties& properties) {
    QList<Position> list;
    QHash<Position, AutotileDatas*>::iterator i;
    for (i = m_all.begin(); i != m_all.end(); i++) {
        Position position = i.key();

        if (position.x() >= properties.length() ||
            position.z() >= properties.width())
        {
            delete *i;
            list.push_back(position);
        }
    }

    for (int j = 0; j < list.size(); j++)
        m_all.remove(list.at(j));
}

// -------------------------------------------------------

MapElement *Autotiles::updateRaycasting(int squareSize, float& finalDistance,
                                        Position &finalPosition, QRay3D &ray)
{
    MapElement* element = nullptr;

    for (QHash<Position, AutotileDatas*>::iterator i = m_all.begin();
         i != m_all.end(); i++)
    {
        Position position = i.key();
        AutotileDatas* autotile = i.value();
        if (updateRaycastingAt(position, autotile, squareSize, finalDistance,
                               finalPosition, ray))
        {
            element = autotile;
        }
    }

    return element;
}

// -------------------------------------------------------

bool Autotiles::updateRaycastingAt(Position &position, AutotileDatas *autotile,
                                   int squareSize, float &finalDistance,
                                   Position &finalPosition, QRay3D& ray)
{
    float newDistance = autotile->intersection(squareSize, ray, position);
    if (Wanok::getMinDistance(finalDistance, newDistance)) {
        finalPosition = position;
        return true;
    }

    return false;
}

// -------------------------------------------------------

int Autotiles::getLastLayerAt(Position& position) const {
    int count = position.layer() + 1;
    Position p(position.x(), position.y(), position.yPlus(), position.z(),
               count);
    AutotileDatas* autotile = getAutotile(p);

    while (autotile != nullptr) {
        count++;
        p.setLayer(count);
        autotile = getAutotile(p);
    }

    return count - 1;
}

// -------------------------------------------------------

void Autotiles::updateRemoveLayer(
        Position& position, QList<QJsonObject> &previous,
        QList<MapEditorSubSelectionKind> &previousType,
        QList<Position> &positions,
        QSet<MapPortion*>& update, QSet<MapPortion*>& save)
{
    int i = position.layer() + 1;
    Position p(position.x(), position.y(), position.yPlus(),
               position.z(), i);
    AutotileDatas* autotile = getAutotile(p);

    while (autotile != nullptr) {
        QJsonObject obj;
        MapEditorSubSelectionKind kind = MapEditorSubSelectionKind::None;
        deleteAutotile(p, obj, kind, update, save);
        previous.append(obj);
        previousType.append(kind);
        positions.append(p);
        p.setLayer(++i);
        autotile = getAutotile(p);
    }
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
        if (element->getSubKind() == MapEditorSubSelectionKind::Autotiles)
            autotilesWithPreview[itw.key()] = (AutotileDatas*) element;
    }
}

// -------------------------------------------------------

AutotileDatas* Autotiles::tileExisting(Position& position, Portion& portion,
                                       QHash<Position, AutotileDatas*> &preview)
{
    Portion newPortion;
    Wanok::get()->project()->currentMap()->getLocalPortion(position,
                                                           newPortion);
    if (portion == newPortion)
        return (AutotileDatas*) preview.value(position);
    else { // If out of current portion
        return (AutotileDatas*) Wanok::get()->project()->currentMap()
            ->mapPortion(newPortion)->getMapElementAt(position,
            MapEditorSelectionKind::Land, MapEditorSubSelectionKind::Autotiles);
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
    Wanok::get()->project()->currentMap()->getLocalPortion(position, portion);
    for (int i = position.x() - 1; i <= position.x() + 1; i++) {
        for (int j = position.z() - 1; j <= position.z() + 1; j++) {
            Position newPosition(i, position.y(), position.yPlus(), j,
                                 position.layer());
            AutotileDatas* newAutotile = tileExisting(newPosition, portion,
                                                      autotiles);
            if (newAutotile != nullptr) {

                // Update the current autotile
                bool changed;
                AutotileDatas* previewAutotile = nullptr;
                if (previousPreview == nullptr)
                    changed = newAutotile->update(newPosition, portion,
                                                  autotiles);
                else {
                    previewAutotile = new AutotileDatas(*newAutotile);
                    changed = previewAutotile->update(newPosition, portion,
                                                      autotiles);
                }

                if (changed) {
                    Portion newPortion;
                    Wanok::get()->project()->currentMap()->getLocalPortion(
                                newPosition, newPortion);

                    // Update view in different portion
                    if (portion != newPortion) {
                        MapPortion* mapPortion = Wanok::get()->project()
                                ->currentMap()->mapPortion(newPortion);
                        update += mapPortion;
                        if (previousPreview == nullptr)
                            save += mapPortion;
                        else
                            *previousPreview += mapPortion;
                    }

                    // If preview, add the autotile to it
                    if (previousPreview != nullptr) {
                        Wanok::get()->project()->currentMap()
                                ->mapPortion(newPortion)
                                ->addPreview(newPosition, previewAutotile);
                    }
                }
            }
        }
    }
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
        int id = 0;
        for (; id < texturesAutotiles.size(); id++) {
            TextureAutotile* textureAutotile = texturesAutotiles[id];
            if (textureAutotile->isInTexture(autotile->autotileID(),
                                             autotile->textureRect()))
            {
                texture = textureAutotile;
                break;
            }
        }
        if (texture->texture() != nullptr) {
            Autotile* autotileGL = m_autotilesGL.at(id);
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
    json["autotile"] = tab;
}
