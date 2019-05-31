/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#include "systemlang.h"
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
