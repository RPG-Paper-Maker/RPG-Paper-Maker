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

#include "mapobjects.h"
#include "wanok.h"
#include "systemstate.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

MapObjects::MapObjects()
{

}

MapObjects::~MapObjects()
{
    QHash<int, QHash<Position, SystemCommonObject*>*>::const_iterator i;
    for (i = m_sprites.begin(); i != m_sprites.end(); i++){
        QHash<Position, SystemCommonObject*>* l = i.value();
        QHash<Position, SystemCommonObject*>::const_iterator j;
        for (j = l->begin(); j != l->end(); j++){
            delete j.value();
        }
        delete l;
    }

    clearSprites();
}

bool MapObjects::isEmpty() const{
    return m_sprites.empty();
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

SystemCommonObject* MapObjects::getObjectAt(Position& p) const{
    QHash<int, QHash<Position, SystemCommonObject*>*>::const_iterator i;
    for (i = m_sprites.begin(); i != m_sprites.end(); i++){
        QHash<Position, SystemCommonObject*>* h = i.value();
        SystemCommonObject* object = h->value(p);
        if (object != nullptr)
            return object;
    }

    return nullptr;
}

// -------------------------------------------------------

void MapObjects::setObject(Position& p, SystemCommonObject* object){
    QHash<Position, SystemCommonObject*>* sprites = m_sprites.value(-1);
    if (sprites != nullptr)
        sprites->insert(p, object);
    else{
        QHash<Position, SystemCommonObject*>* h =
                new QHash<Position, SystemCommonObject*>;
        h->insert(p, object);
        m_sprites[-1] = h;
    }
}

// -------------------------------------------------------

SystemCommonObject* MapObjects::removeObject(Position& p){
    QHash<Position, SystemCommonObject*>* sprites = m_sprites.value(-1);
    if (sprites != nullptr){
        QHash<Position, SystemCommonObject*>::const_iterator i;
        for (i = sprites->begin(); i != sprites->end(); i++){
            Position p2 = i.key();
            SystemCommonObject* o = i.value();
            if (p == p2){
                sprites->remove(p);
                if (sprites->isEmpty())
                    m_sprites.remove(-1);
                return o;
            }
        }
    }

    return nullptr;
}

// -------------------------------------------------------

bool MapObjects::addObject(Position& p, SystemCommonObject* object){
    SystemCommonObject* previousObject = removeObject(p);

    if (previousObject != nullptr)
        delete previousObject;

    setObject(p, object);

    return true;
}

// -------------------------------------------------------

bool MapObjects::deleteObject(Position& p){
    SystemCommonObject* previousObject = removeObject(p);

    if (previousObject != nullptr)
        delete previousObject;

    return true;
}

// -------------------------------------------------------
//
//  GL
//
// -------------------------------------------------------

void MapObjects::clearSprites(){
    for (int i = 0; i < m_spritesGL.size(); i++)
        delete m_spritesGL.at(i);
    m_spritesGL.clear();
}

// -------------------------------------------------------

void MapObjects::initializeVertices(int squareSize,
                                    QHash<int, QOpenGLTexture *> &characters)
{
    clearSprites();
    QHash<int, QHash<Position, SystemCommonObject*>*>::iterator i;
    for (i = m_sprites.begin(); i != m_sprites.end(); i++){
        QHash<Position, SystemCommonObject*>* h = i.value();
        QHash<Position, SystemCommonObject*>::iterator j;
        for (j = h->begin(); j != h->end(); j++){
            Position position = j.key();
            SystemCommonObject* o = j.value();
            SystemState* state = o->getFirstState();

            if (state != nullptr){
                QOpenGLTexture* texture = characters[state->graphicsId()];
                if (texture == nullptr)
                    texture = characters[-1];
                int frames = Wanok::get()->project()->gameDatas()->systemDatas()
                        ->framesAnimation();
                int width = texture->width() / frames / squareSize;
                int height = texture->height() / frames / squareSize;
                SpriteDatas sprite(
                            0, 50, 0,
                            new QRect(state->indexX() * width,
                                      state->indexY() * height,
                                      width, height));
                SpriteObject* spriteObject = new SpriteObject(sprite, texture);
                spriteObject->initializeVertices(squareSize, position);
                m_spritesGL.append(spriteObject);
            }
        }
    }
}

// -------------------------------------------------------

void MapObjects::initializeGL(QOpenGLShaderProgram *programStatic){
    for (int i = 0; i < m_spritesGL.size(); i++)
        m_spritesGL.at(i)->initializeGL(programStatic);
}

// -------------------------------------------------------

void MapObjects::updateGL(){
    for (int i = 0; i < m_spritesGL.size(); i++)
        m_spritesGL.at(i)->updateGL();
}

// -------------------------------------------------------

void MapObjects::paintGL(){
    for (int i = 0; i < m_spritesGL.size(); i++)
        m_spritesGL.at(i)->paintGL();
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void MapObjects::read(const QJsonObject & json){
    QJsonArray tab = json["sprites"].toArray();

    // Sprites
    for (int i = 0; i < tab.size(); i++){
        QJsonObject obj = tab.at(i).toObject();
        int k = obj["k"].toInt();
        QJsonArray tabValue = obj["v"].toArray();
        QHash<Position, SystemCommonObject*>* h =
                new QHash<Position, SystemCommonObject*>;
        for (int j = 0; j < tabValue.size(); j++){
            QJsonObject objHash = tabValue.at(j).toObject();
            Position p;
            p.read(objHash["k"].toArray());
            SystemCommonObject* o = new SystemCommonObject;
            o->read(objHash["v"].toObject());
            h->insert(p, o);
        }
        m_sprites[k] = h;
    }
}

// -------------------------------------------------------

void MapObjects::write(QJsonObject & json) const{

    // Sprites
    QJsonArray tabSprites;
    QHash<int, QHash<Position, SystemCommonObject*>*>::const_iterator i;
    for (i = m_sprites.begin(); i != m_sprites.end(); i++){
        QJsonObject objHash;
        QJsonValue vKey = i.key();
        QJsonArray tabValue;
        QHash<Position, SystemCommonObject*>* hashPosition = i.value();

        QHash<Position, SystemCommonObject*>::const_iterator j;
        for (j = hashPosition->begin(); j != hashPosition->end(); j++){
            QJsonObject objHashPosition;
            QJsonArray tabKeyPosition;
            QJsonObject objValuePosition;
            j.key().write(tabKeyPosition);
            j.value()->write(objValuePosition);
            objHashPosition["k"] = tabKeyPosition;
            objHashPosition["v"] = objValuePosition;
            tabValue.append(objHashPosition);
        }

        objHash["k"] = vKey;
        objHash["v"] = tabValue;
        tabSprites.append(objHash);
    }
    json["sprites"] = tabSprites;
}
