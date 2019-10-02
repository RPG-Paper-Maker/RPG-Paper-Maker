/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void SystemLang::setDefault(){
    setName(p_name);
}

// -------------------------------------------------------

QString SystemLang::name() const {
    return m_names->mainName();
}

// -------------------------------------------------------

void SystemLang::setName(QString n){
    SuperListItem::setName(n);
    m_names->setMainName(n);
}

// -------------------------------------------------------

void SystemLang::getCommand(QVector<QString> &command) {
    m_names->getCommand(command);
}

// -------------------------------------------------------

void SystemLang::initializeCommand(EventCommand *command, int &i) {
    m_names->initializeCommand(command, i);
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

void SystemLang::setCopy(const SuperListItem &super) {
    const SystemLang *lang;

    lang = reinterpret_cast<const SystemLang *>(&super);
    SuperListItem::setCopy(*lang);

    m_names->setCopy(*lang->m_names);
    setName(m_names->mainName());
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
