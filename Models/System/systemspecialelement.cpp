/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#include "systemspecialelement.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemSpecialElement::SystemSpecialElement() :
    SystemSpecialElement(1, "", 1)
{

}

SystemSpecialElement::SystemSpecialElement(int i, QString n, int pictureId) :
    SuperListItem(i, n),
    m_pictureID(pictureId)
{

}

SystemSpecialElement::~SystemSpecialElement()
{

}

SystemPicture* SystemSpecialElement::picture() const {
    return nullptr;
}

void SystemSpecialElement::setPictureID(int id) {
    m_pictureID = id;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

SuperListItem* SystemSpecialElement::createCopy() const{
    SystemSpecialElement* super = new SystemSpecialElement;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemSpecialElement::setCopy(const SystemSpecialElement& super){
    SuperListItem::setCopy(super);

    m_pictureID = super.m_pictureID;
}

// -------------------------------------------------------

SystemPicture* SystemSpecialElement::pictureByKind(PictureKind kind) const {
    return (SystemPicture*) SuperListItem::getById(
                RPM::get()->project()->picturesDatas()->model(kind)
                ->invisibleRootItem(), m_pictureID);
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void SystemSpecialElement::read(const QJsonObject &json){
    SuperListItem::read(json);

    m_pictureID = json["pic"].toInt();
}

// -------------------------------------------------------

void SystemSpecialElement::write(QJsonObject &json) const{
    SuperListItem::write(json);

    json["pic"] = m_pictureID;
}
