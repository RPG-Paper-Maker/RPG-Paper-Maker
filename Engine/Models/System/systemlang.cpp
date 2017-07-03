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

#include "systemlang.h"
#include "main.h"
#include "dialogsystemlang.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemLang::SystemLang() :
    SystemLang(1, new LangsTranslation)
{

}

SystemLang::SystemLang(int i, LangsTranslation *names) :
    SuperListItem(i, names->defaultMainName()),
    m_names(names)
{

}

SystemLang::~SystemLang(){
    delete m_names;
}

LangsTranslation* SystemLang::names() const { return m_names; }

void SystemLang::setName(QString n){
    SuperListItem::setName(n);
    m_names->setMainName(n);
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void SystemLang::setDefault(){
    setName(p_name);
}

// -------------------------------------------------------

bool SystemLang::openDialog(){
    SystemLang super;
    super.setCopy(*this);
    DialogSystemLang dialog(super);
    if (dialog.exec() == QDialog::Accepted){
        setCopy(super);
        return true;
    }
    return false;
}

// -------------------------------------------------------

SuperListItem* SystemLang::createCopy() const{
    SystemLang* super = new SystemLang;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemLang::setCopy(const SystemLang& item){
    SuperListItem::setCopy(item);

    m_names->setCopy(*item.m_names);
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void SystemLang::read(const QJsonObject &json){
    SuperListItem::readId(json);
    QJsonObject obj = json["names"].toObject();

    m_names->read(obj);
    setName(m_names->mainName());
}

void SystemLang::write(QJsonObject &json) const{
    SuperListItem::writeId(json);
    QJsonObject obj;

    m_names->write(obj);
    json["names"] = obj;
}
