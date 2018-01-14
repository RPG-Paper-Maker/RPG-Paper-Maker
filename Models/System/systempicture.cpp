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

#include "systempicture.h"
#include "wanok.h"

QString SystemPicture::pathIconRed = ":/icons/Ressources/point_r.png";
QString SystemPicture::pathIconBlue = ":/icons/Ressources/point_b.png";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemPicture::SystemPicture() :
    SystemPicture(-1, "<None>", false)
{

}

SystemPicture::SystemPicture(int i, QString n, bool isBR) :
    SuperListItem(i,n),
    m_isBR(isBR)
{

}

SystemPicture::~SystemPicture(){

}

bool SystemPicture::isBR() const { return m_isBR; }

void SystemPicture::setIsBR(bool b) { m_isBR = b; }

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

QString SystemPicture::getFolder(PictureKind kind, bool isBR){
    QString folder = isBR ? Wanok::get()->project()->gameDatas()->systemDatas()
                            ->pathBR()
                          : Wanok::get()->project()->pathCurrentProject();

    return Wanok::pathCombine(folder, getLocalFolder(kind));
}

// -------------------------------------------------------

QString SystemPicture::getLocalFolder(PictureKind kind){
    switch (kind){
    case PictureKind::Bars:
        return Wanok::pathBars;
    case PictureKind::Icons:
        return Wanok::pathIcons;
    case PictureKind::Autotiles:
        return Wanok::pathAutotiles;
    case PictureKind::Characters:
        return Wanok::pathCharacters;
    case PictureKind::Reliefs:
        return Wanok::pathReliefs;
    case PictureKind::Tilesets:
        return Wanok::pathTilesets;
    case PictureKind::Walls:
        return Wanok::PATH_SPRITE_WALLS;
    default:
        throw std::invalid_argument("Kind of picture path not implemented");
    }
}

// -------------------------------------------------------

QString SystemPicture::getPath(PictureKind kind) const{
    if (id() == -1)
        return "";

    QString folder = getFolder(kind, m_isBR);

    return Wanok::pathCombine(folder, name());
}

// -------------------------------------------------------

QString SystemPicture::getLocalPath(PictureKind kind) const{
    QString folder = getLocalFolder(kind);

    return Wanok::pathCombine(folder, name());
}

// -------------------------------------------------------

SuperListItem* SystemPicture::createCopy() const{
    SystemPicture* super = new SystemPicture;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemPicture::setCopy(const SystemPicture& super){
    SuperListItem::setCopy(super);

    m_isBR = super.m_isBR;
}

// -------------------------------------------------------

QList<QStandardItem *> SystemPicture::getModelRow() const{
    QList<QStandardItem*> row = QList<QStandardItem*>();
    QStandardItem* item = new QStandardItem;
    QIcon icon = m_isBR ? QIcon(SystemPicture::pathIconBlue)
                        : QIcon(SystemPicture::pathIconRed);

    item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(this)));

    if (id() != -1)
        item->setIcon(icon);

    item->setFlags(item->flags() ^ (Qt::ItemIsDropEnabled));
    item->setText(toString());
    row.append(item);

    return row;
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void SystemPicture::read(const QJsonObject &json){
    SuperListItem::read(json);

    m_isBR = json["br"].toBool();
}

// -------------------------------------------------------

void SystemPicture::write(QJsonObject &json) const{
    SuperListItem::write(json);

    json["br"] = m_isBR;
}
