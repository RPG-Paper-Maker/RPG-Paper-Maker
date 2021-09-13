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

const QString SystemHero::JSON_CLASS = "class";
const QString SystemHero::JSON_BATTLER = "bid";
const QString SystemHero::JSON_FACESET = "fid";
const QString SystemHero::JSON_CLASS_INHERIT = "ci";
const QString SystemHero::JSON_DESCRIPTION = "description";
const int SystemHero::DEFAULT_ID = 1;
const QString SystemHero::DEFAULT_NAME = "";
const int SystemHero::DEFAULT_ID_CLASS = 1;
const int SystemHero::DEFAULT_ID_BATTLER = 1;
const int SystemHero::DEFAULT_ID_FACESET = 1;

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemHero::SystemHero(int i, QString name, int idClass, int idBattler, int
    idFaceset, SystemClass *classInherit, SystemTranslatable *description) :
    SystemTranslatable(i, name),
    m_idClass(idClass),
    m_idBattlerPicture(idBattler),
    m_idFacesetPicture(idFaceset),
    m_classInherit(classInherit),
    m_description(description)
{

}

SystemHero::~SystemHero()
{
    delete m_classInherit;
    delete m_description;
}

int SystemHero::idClass() const
{
    return m_idClass;
}

void SystemHero::setIdClass(int id)
{
    m_idClass = id;
}

int SystemHero::idBattlerPicture() const
{
    return m_idBattlerPicture;
}

void SystemHero::setIdBattlerPicture(int id)
{
    m_idBattlerPicture = id;
}

int SystemHero::idFacesetPicture() const
{
    return m_idFacesetPicture;
}

void SystemHero::setIdFacesetPicture(int id)
{
    m_idFacesetPicture = id;
}

SystemClass * SystemHero::classInherit() const
{
    return m_classInherit;
}

SystemTranslatable * SystemHero::description() const
{
    return m_description;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

SystemPicture * SystemHero::getPictureBattler() const
{
    return reinterpret_cast<SystemPicture*>(SuperListItem::getById(RPM::get()
        ->project()->picturesDatas()->model(PictureKind::Battlers)
        ->invisibleRootItem(), m_idBattlerPicture));
}

// -------------------------------------------------------

SystemPicture* SystemHero::getPictureFaceset() const
{
    return reinterpret_cast<SystemPicture*>(SuperListItem::getById(RPM::get()
        ->project()->picturesDatas()->model(PictureKind::Facesets)
        ->invisibleRootItem(), m_idFacesetPicture));
}

// -------------------------------------------------------


SystemClass * SystemHero::getClass() const
{
    return reinterpret_cast<SystemClass *>(SuperListItem::getById(RPM::get()
        ->project()->gameDatas()->classesDatas()->model()->invisibleRootItem(),
        m_idClass));
}

// -------------------------------------------------------


int SystemHero::maxLevel() const
{
    return m_classInherit->maxLevel() == -1 ? getClass()->maxLevel() :
        m_classInherit->maxLevel();
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

SuperListItem * SystemHero::createCopy() const
{
    SystemHero *super = new SystemHero;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemHero::setCopy(const SuperListItem &super)
{
    SystemTranslatable::setCopy(super);
    const SystemHero *hero = reinterpret_cast<const SystemHero *>(&super);
    m_idClass = hero->m_idClass;
    m_idBattlerPicture = hero->m_idBattlerPicture;
    m_idFacesetPicture = hero->m_idFacesetPicture;
    m_classInherit->setCopy(*hero->m_classInherit);
    m_description->setCopy(*hero->m_description);
}

// -------------------------------------------------------

void SystemHero::read(const QJsonObject &json)
{
    SystemTranslatable::read(json);
    m_idClass = json[JSON_CLASS].toInt();
    m_idBattlerPicture = json[JSON_BATTLER].toInt();
    m_idFacesetPicture = json[JSON_FACESET].toInt();
    m_classInherit->read(json[JSON_CLASS_INHERIT].toObject());
    m_description->read(json[JSON_DESCRIPTION].toObject());
}

// -------------------------------------------------------

void SystemHero::write(QJsonObject &json) const
{
    SystemTranslatable::write(json);
    json[JSON_CLASS] = m_idClass;
    json[JSON_BATTLER] = m_idBattlerPicture;
    json[JSON_FACESET] = m_idFacesetPicture;
    QJsonObject obj;
    m_classInherit->write(obj);
    json[JSON_CLASS_INHERIT] = obj;
    obj = QJsonObject();
    m_description->write(obj);
    json[JSON_DESCRIPTION] = obj;
}
