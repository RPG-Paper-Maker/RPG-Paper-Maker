/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

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

#include "langstranslation.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

LangsTranslation::LangsTranslation()
{

}

LangsTranslation::LangsTranslation(QString name) :
    LangsTranslation()
{
    m_names[1] = name;
}

LangsTranslation::LangsTranslation(QVector<int> ids, QVector<QString> names) :
    LangsTranslation()
{
    for (int i = 0; i < ids.size(); i++)
        m_names[ids[i]] = names[i];
}

LangsTranslation::~LangsTranslation()
{

}

int LangsTranslation::mainId() const{
    int i;
    if (RPM::get()->project() == nullptr)
        i = 1;
    else
        i = RPM::get()->project()->langsDatas()->mainLang();

    return i;
}

QString LangsTranslation::mainName() const{
    return m_names[mainId()];
}

void LangsTranslation::setMainName(QString n){
    m_names[mainId()] = n;
}

QString LangsTranslation::defaultMainName() const{
    return m_names[1];
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void LangsTranslation::setCopy(const LangsTranslation& super){
    m_names = super.m_names;
}

// -------------------------------------------------------

void LangsTranslation::updateNames(){
    QHash<int,QString> names = m_names;
    LangsDatas* datas = RPM::get()->project()->langsDatas();
    int l;

    l = datas->model()->invisibleRootItem()->rowCount();
    for (int i = 0; i < l - 1; i++){
        int entry = ((SuperListItem*) datas->model()->item(i)->data()
                     .value<quintptr>())->id();
        m_names[entry] = names[entry];
    }
}

// -------------------------------------------------------

void LangsTranslation::setAllNames(QString n){
    QHash<int, QString>::const_iterator i;
    for (i = m_names.begin(); i != m_names.end(); i++){
        m_names[i.key()] = n;
    }
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void LangsTranslation::read(const QJsonObject &json){
    QJsonObject::const_iterator i;
    for (i = json.begin(); i != json.end(); i++){
        m_names[i.key().toInt()] = i.value().toString();
    }
}

void LangsTranslation::write(QJsonObject &json) const{
    QHash<int, QString>::const_iterator i;
    for (i = m_names.begin(); i != m_names.end(); i++){
        json[QString::number(i.key())] = i.value();
    }
}
