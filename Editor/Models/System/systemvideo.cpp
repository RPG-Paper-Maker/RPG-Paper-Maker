/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "systemvideo.h"
#include "rpm.h"
#include "common.h"

const QString SystemVideo::JSON_BR = "br";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemVideo::SystemVideo() :
    SystemVideo(-1, "<" + RPM::translate(Translations::NONE) + ">", false)
{

}

SystemVideo::SystemVideo(int i, QString n, bool isBR) :
    SuperListItem(i, n),
    m_isBR(isBR)
{

}

SystemVideo::~SystemVideo() {

}

bool SystemVideo::isBR() const {
    return m_isBR;
}

void SystemVideo::setIsBR(bool b) {
    m_isBR = b;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

SystemVideo * SystemVideo::getByID(int id) {
    return reinterpret_cast<SystemVideo *>(SuperListItem::getById(RPM::get()
        ->project()->videosDatas()->model()->invisibleRootItem(), id));
}

// -------------------------------------------------------

QString SystemVideo::getFolder(bool isBR) {
    QString folder = isBR ? RPM::get()->project()->gameDatas()->systemDatas()
        ->pathBR() : RPM::get()->project()->pathCurrentProjectApp();

    return Common::pathCombine(folder, getLocalFolder());
}

// -------------------------------------------------------

QString SystemVideo::getLocalFolder() {
    return RPM::PATH_VIDEOS;
}

// -------------------------------------------------------

QString SystemVideo::getPath() const {
    if (id() == -1) {
        return "";
    }

    QString folder = getFolder(m_isBR);

    return Common::pathCombine(folder, name());
}

// -------------------------------------------------------

QString SystemVideo::getLocalPath() const {
    QString folder = getLocalFolder();

    return Common::pathCombine(folder, name());
}

// -------------------------------------------------------
//
// VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

SuperListItem * SystemVideo::createCopy() const {
    SystemVideo *super = new SystemVideo;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemVideo::setCopy(const SuperListItem &super) {
    const SystemVideo *video;

    SuperListItem::setCopy(super);

    video = reinterpret_cast<const SystemVideo *>(&super);
    m_isBR = video->m_isBR;
}

// -------------------------------------------------------

QList<QStandardItem *> SystemVideo::getModelRow() const {
    QList<QStandardItem *> row = QList<QStandardItem *>();
    QStandardItem *item = new QStandardItem;
    QIcon icon = m_isBR ? QIcon(SuperListItem::pathIconBlue) : QIcon(
        SuperListItem::pathIconRed);

    item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(this)));

    if (id() > 0) {
        item->setIcon(icon);
    }

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

void SystemVideo::read(const QJsonObject &json) {
    SuperListItem::read(json);

    m_isBR = json[JSON_BR].toBool();
}

// -------------------------------------------------------

void SystemVideo::write(QJsonObject &json) const {
    SuperListItem::write(json);

    json[JSON_BR] = m_isBR;
}
