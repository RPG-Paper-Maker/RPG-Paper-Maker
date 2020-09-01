/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "systemresource.h"
#include "rpm.h"
#include "common.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemResource::SystemResource() :
    SystemResource(-1, "<" + RPM::translate(Translations::NONE) + ">", false)
{

}

SystemResource::SystemResource(int i, QString n, bool isBR, QString dlc) :
    SuperListItem(i,n),
    m_isBR(isBR),
    m_dlc(dlc)
{

}

SystemResource::~SystemResource()
{

}

bool SystemResource::isBR() const
{
    return m_isBR;
}

void SystemResource::setIsBR(bool b)
{
    m_isBR = b;
}

QString SystemResource::dlc() const
{
    return m_dlc;
}
void SystemResource::setDlc(QString dlc)
{
    m_dlc = dlc;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

QString SystemResource::getFolder(bool br, QString dlc)
{
    return br ? RPM::get()->project()->gameDatas()->systemDatas()->pathBR() : (
        dlc.isEmpty() ? RPM::get()->project()->pathCurrentProjectApp() : Common
        ::pathCombine(RPM::get()->project()->gameDatas()->dlcsDatas()->path(),
        dlc));
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

QString SystemResource::getPath() const
{
   return "";
}

QString SystemResource::getLocalPath() const
{
    return "";
}

SuperListItem* SystemResource::createCopy() const{
    SystemResource* super = new SystemResource;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemResource::setCopy(const SuperListItem &super) {
    const SystemResource *resource;

    SuperListItem::setCopy(super);

    resource = reinterpret_cast<const SystemResource *>(&super);
    m_isBR = resource->m_isBR;
    m_dlc = resource->m_dlc;
}

// -------------------------------------------------------

QList<QStandardItem *> SystemResource::getModelRow() const{
    QList<QStandardItem*> row = QList<QStandardItem*>();
    QStandardItem* item = new QStandardItem;
    QIcon icon = QIcon(m_isBR ? SuperListItem::pathIconBlue : (m_dlc.isEmpty() ?
        SuperListItem::pathIconRed : RPM::PATH_ICON_GREEN));

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

void SystemResource::read(const QJsonObject &json){
    SuperListItem::read(json);

    m_isBR = json["br"].toBool();
    if (json.contains("d"))
    {
        m_dlc = json["d"].toString();
    }
}

// -------------------------------------------------------

void SystemResource::write(QJsonObject &json) const{
    SuperListItem::write(json);

    json["br"] = m_isBR;
    if (!m_dlc.isEmpty())
    {
        json["d"] = m_dlc;
    }
}
