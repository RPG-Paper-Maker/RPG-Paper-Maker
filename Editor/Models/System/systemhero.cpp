/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "systemhero.h"
#include "rpm.h"
#include "superlistitem.h"

// -------------------------------------------------------
//
//  STATIC / CONST VARIABLES
//
// -------------------------------------------------------

const QString SystemHero::jsonClass = "class";
const QString SystemHero::jsonBattler = "bid";
const QString SystemHero::jsonFaceset = "fid";
const QString SystemHero::jsonClassInherit = "ci";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemHero::SystemHero() :
    SystemHero(1, new LangsTranslation, 1, 1, 1, new SystemClass)
{

}

SystemHero::SystemHero(int i, LangsTranslation* names, int idClass,
    int idBattler, int idFaceset, SystemClass *classInherit) :
    SystemLang(i, names),
    m_idClass(idClass),
    m_idBattlerPicture(idBattler),
    m_idFacesetPicture(idFaceset),
    m_classInherit(classInherit)
{

}

SystemHero::~SystemHero() {
    delete m_classInherit;
}

int SystemHero::idClass() const {
    return m_idClass;
}

void SystemHero::setIdClass(int id) {
    m_idClass = id;
}

int SystemHero::idBattlerPicture() const {
    return m_idBattlerPicture;
}

void SystemHero::setIdBattlerPicture(int id) {
    m_idBattlerPicture = id;
}

int SystemHero::idFacesetPicture() const {
    return m_idFacesetPicture;
}

void SystemHero::setIdFacesetPicture(int id) {
    m_idFacesetPicture = id;
}

SystemClass * SystemHero::classInherit() const {
    return m_classInherit;
}

SystemPicture* SystemHero::getPictureBattler() const {
    return reinterpret_cast<SystemPicture*>(SuperListItem::getById(RPM::get()
        ->project()->picturesDatas()->model(PictureKind::Battlers)
        ->invisibleRootItem(), m_idBattlerPicture));
}

SystemPicture* SystemHero::getPictureFaceset() const {
    return reinterpret_cast<SystemPicture*>(SuperListItem::getById(RPM::get()
        ->project()->picturesDatas()->model(PictureKind::Facesets)
        ->invisibleRootItem(), m_idFacesetPicture));
}

SystemClass * SystemHero::getClass() const {
    return reinterpret_cast<SystemClass *>(SuperListItem::getById(RPM::get()
        ->project()->gameDatas()->classesDatas()->model()->invisibleRootItem(),
        m_idClass));
}

int SystemHero::maxLevel() const {
    return m_classInherit->maxLevel() == -1 ? getClass()->maxLevel() :
        m_classInherit->maxLevel();
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------



SuperListItem* SystemHero::createCopy() const {
    SystemHero *super = new SystemHero;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemHero::setCopy(const SuperListItem &super) {
    const SystemHero *hero;

    SystemLang::setCopy(super);
    hero = reinterpret_cast<const SystemHero *>(&super);
    m_idClass = hero->m_idClass;
    m_idBattlerPicture = hero->m_idBattlerPicture;
    m_idFacesetPicture = hero->m_idFacesetPicture;
    m_classInherit->setCopy(*hero->m_classInherit);
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void SystemHero::read(const QJsonObject &json){
    SystemLang::read(json);
    m_idClass = json[jsonClass].toInt();
    m_idBattlerPicture = json[jsonBattler].toInt();
    m_idFacesetPicture = json[jsonFaceset].toInt();
    m_classInherit->read(json[jsonClassInherit].toObject());
}

void SystemHero::write(QJsonObject &json) const{
    SystemLang::write(json);
    json[jsonClass] = m_idClass;
    json[jsonBattler] = m_idBattlerPicture;
    json[jsonFaceset] = m_idFacesetPicture;
    QJsonObject obj;
    m_classInherit->write(obj);
    json[jsonClassInherit] = obj;
}
