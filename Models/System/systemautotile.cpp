/*
    RPG Paper Maker Copyright (C) 2017-2018 Marie Laporte

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
    SystemSpecialElement(i, n, pictureId)
{

}

SystemAutotile::~SystemAutotile()
{

}

SystemPicture* SystemAutotile::picture() const {
    return pictureByKind(PictureKind::Autotiles);
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
