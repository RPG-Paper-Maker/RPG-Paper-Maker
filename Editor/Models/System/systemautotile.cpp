/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "systemautotile.h"
#include "rpm.h"

int SystemAutotile::NUMBER_ROWS = 3;
int SystemAutotile::NUMBER_COLUMNS = 2;

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemAutotile::SystemAutotile() :
    SystemSpecialElement()
{

}

SystemAutotile::SystemAutotile(int i, QString n, int pictureId) :
    SystemSpecialElement(i, n, ShapeKind::Box, -1, -1, pictureId)
{

}

SystemAutotile::~SystemAutotile()
{

}

SystemPicture* SystemAutotile::picture() const {
    SystemPicture *picture;

    picture = this->pictureByKind(PictureKind::Autotiles);
    if (picture == nullptr) {
        picture = RPM::get()->project()->picturesDatas()->missingPicture();
        picture->setId(m_pictureID);
    }

    return picture;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

SuperListItem* SystemAutotile::createCopy() const{
    SystemAutotile* super = new SystemAutotile;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemAutotile::setCopy(const SystemAutotile& super){
    SystemSpecialElement::setCopy(super);
}

// -------------------------------------------------------

int SystemAutotile::getPreviewWidth(QImage& image) {
    return getPreviewColumns(image) * RPM::get()->getSquareSize();
}

// -------------------------------------------------------

int SystemAutotile::getPreviewHeight(QImage& image) {
    return getPreviewRows(image) * RPM::get()->getSquareSize();
}

// -------------------------------------------------------

int SystemAutotile::getPreviewColumns(QImage& image) {
    return getPreviewSize(image.width()) / SystemAutotile::NUMBER_COLUMNS;
}

// -------------------------------------------------------

int SystemAutotile::getPreviewRows(QImage& image) {
    return getPreviewSize(image.height()) / SystemAutotile::NUMBER_ROWS;
}

// -------------------------------------------------------

int SystemAutotile::getPreviewSize(int size) {
    return size / RPM::get()->getSquareSize();
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void SystemAutotile::read(const QJsonObject &json){
    SystemSpecialElement::read(json);
}

// -------------------------------------------------------

void SystemAutotile::write(QJsonObject &json) const{
    SystemSpecialElement::write(json);
}
