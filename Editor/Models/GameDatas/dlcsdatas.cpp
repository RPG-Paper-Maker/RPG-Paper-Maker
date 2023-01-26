/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include <QDir>
#include "dlcsdatas.h"
#include "rpm.h"
#include "common.h"

const QString DlcsDatas::JSON_LIST = "l";
const QString DlcsDatas::JSON_PATH = "p";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DlcsDatas::DlcsDatas()
{

}

DlcsDatas::~DlcsDatas()
{

}

int DlcsDatas::dlcsCount() const
{
    return m_list.size();
}

QString DlcsDatas::dlcAt(int i) const
{
    return m_list.at(i);
}

void DlcsDatas::deleteDlc(QString dlc)
{
    m_list.removeOne(dlc);
}

void DlcsDatas::addDlc(QString dlc)
{
    if (!m_list.contains(dlc))
    {
        m_list.append(dlc);
    }
}

bool DlcsDatas::containsDlc(QString dlc)
{
    return m_list.contains(dlc);
}

QString DlcsDatas::path() const
{
    return m_path;
}

void DlcsDatas::setPath(QString p)
{
    m_path = p;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DlcsDatas::read(QString path)
{
    RPM::readJSON(Common::pathCombine(path, RPM::PATH_DLCS_DATAS), *this);
}

// -------------------------------------------------------

void DlcsDatas::setDefault()
{
    m_path = Common::pathCombine(QDir::currentPath(), RPM::PATH_DLCS);
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

void DlcsDatas::read(const QJsonObject &json)
{
    QJsonArray tab;

    m_path = json[JSON_PATH].toString();
    m_list.clear();
    if (json.contains(JSON_LIST))
    {
        tab = json[JSON_LIST].toArray();
        QString filename;
        for (int i = 0, l = tab.size(); i < l; i++)
        {
            filename = tab.at(i).toString();
            if (QDir(Common::pathCombine(m_path, filename)).exists())
            {
                m_list << filename;
            }
        }
    }
}

// -------------------------------------------------------

void DlcsDatas::write(QJsonObject &json) const
{
    QJsonArray tab;

    for (int i = 0, l = m_list.size(); i < l; i++)
    {
        tab.append(m_list.at(i));
    }
    if (!tab.isEmpty())
    {
        json[JSON_LIST] = tab;
    }
    json[JSON_PATH] = m_path;
}
