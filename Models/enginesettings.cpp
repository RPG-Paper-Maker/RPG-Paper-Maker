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

#include "enginesettings.h"
#include "wanok.h"
#include <QDir>

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

EngineSettings::EngineSettings() :
    m_keyBoardDatas(new KeyBoardDatas)
{

}

EngineSettings::~EngineSettings()
{
    delete m_keyBoardDatas;
}

void EngineSettings::read(){
    Wanok::readJSON(Wanok::pathCombine(QDir::currentPath(),
                                       Wanok::pathEngineSettings), *this);
}

void EngineSettings::write(){
    Wanok::writeJSON(Wanok::pathCombine(QDir::currentPath(),
                                        Wanok::pathEngineSettings), *this);
}

KeyBoardDatas* EngineSettings::keyBoardDatas() const {
    return m_keyBoardDatas;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void EngineSettings::setDefault(){
    m_keyBoardDatas->setDefaultEngine();
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void EngineSettings::read(const QJsonObject &json){
    m_keyBoardDatas->read(json["kb"].toObject());
}

// -------------------------------------------------------

void EngineSettings::write(QJsonObject &json) const{
    QJsonObject obj;

    m_keyBoardDatas->write(obj);
    json["kb"] = obj;
}
