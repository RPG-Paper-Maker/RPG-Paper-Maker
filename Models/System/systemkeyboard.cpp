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

#include "systemkeyboard.h"
#include "dialogsystemkeyboardgeneral.h"
#include "wanok.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemKeyBoard::SystemKeyBoard() :
    SystemKeyBoard(1, new LangsTranslation(""), "")
{

}

SystemKeyBoard::SystemKeyBoard(int i, LangsTranslation *names,
                               QString abreviation) :
    SystemKeyBoard(i, names, abreviation, QVector<QVector<int>>({}))
{

}

SystemKeyBoard::SystemKeyBoard(int i, LangsTranslation *names,
                               QString abreviation,
                               QVector<QVector<int>> shortcut) :
    SystemLang(i,names),
    m_abbreviation(abreviation),
    m_shortcuts(shortcut)
{

}

SystemKeyBoard::~SystemKeyBoard(){

}

QString SystemKeyBoard::abbreviation() const { return m_abbreviation; }

void SystemKeyBoard::setAbbreviation(QString s) { m_abbreviation = s; }

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void SystemKeyBoard::appendShortCut(QVector<int> v){
    m_shortcuts.append(v);
}

// -------------------------------------------------------


void SystemKeyBoard::updateLastShortCut(QVector<int> v){
    m_shortcuts[m_shortcuts.size() - 1] = v;
}

// -------------------------------------------------------

QString SystemKeyBoard::shortCutString() const{
    QString strAND;
    QStringList listOR, listAND;
    int i, j, l, ll;

    l = m_shortcuts.size();
    for (i = 0, l = m_shortcuts.size(); i < l; i++){
        listAND.clear();
        for (j = 0, ll = m_shortcuts[i].size(); j < ll; j++){
            int shortCut = m_shortcuts[i][j];
            listAND.append(Wanok::keyToString(shortCut));
        }
        strAND = listAND.join(" + ");
        listOR.append(strAND);
    }

    return listOR.join(" | ");
}

// -------------------------------------------------------

bool SystemKeyBoard::isEqual(int key) const{
    int i, l, ll;

    l = m_shortcuts.size();
    for (i = 0; i < l; i++){
        ll = m_shortcuts[i].size();
        if (ll == 1){
            if (m_shortcuts[i][0] == key)
                return true;
        }
        else{
            return false;
        }
    }

    return false;
}

// -------------------------------------------------------

void SystemKeyBoard::removeLast(){
    if (!m_shortcuts.isEmpty())
        m_shortcuts.removeLast();
}

// -------------------------------------------------------

void SystemKeyBoard::removeAll(){
    m_shortcuts.clear();
}

// -------------------------------------------------------

QString SystemKeyBoard::toString() const{
    return (QString(beginningText) + idToString() + QString(": ") +
            m_abbreviation);
}

// -------------------------------------------------------

bool SystemKeyBoard::openDialog(){
    SystemKeyBoard key;
    key.setCopy(*this);
    DialogSystemKeyBoardGeneral dialog(key);
    if (dialog.exec() == QDialog::Accepted){
        setCopy(key);
        return true;
    }

    return false;
}

// -------------------------------------------------------

SuperListItem* SystemKeyBoard::createCopy() const{
    SystemKeyBoard* super = new SystemKeyBoard;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemKeyBoard::setCopy(const SystemKeyBoard& k){
    SuperListItem::setCopy(k);

    // Abbreviation
    m_abbreviation = k.m_abbreviation;

    // Shortcuts
    m_shortcuts.clear();
    for (int i = 0; i < k.m_shortcuts.size(); i++){
        m_shortcuts.append(QVector<int>());
        for (int j = 0; j < k.m_shortcuts[i].size(); j++)
            m_shortcuts[i].append(k.m_shortcuts[i][j]);
    }
}

// -------------------------------------------------------

QList<QStandardItem *> SystemKeyBoard::getModelRow() const{
    QList<QStandardItem*> row = QList<QStandardItem*>();
    QStandardItem* itemAbbreviation = new QStandardItem;
    QStandardItem* itemDescription = new QStandardItem;
    QStandardItem* itemShortCut = new QStandardItem;

    itemAbbreviation->setData(QVariant::fromValue(
                                 reinterpret_cast<quintptr>(this)));
    itemAbbreviation->setText(toString());
    itemDescription->setData(QVariant::fromValue(
                                 reinterpret_cast<quintptr>(this)));
    itemDescription->setText(name());
    itemShortCut->setData(QVariant::fromValue(
                                 reinterpret_cast<quintptr>(this)));
    itemShortCut->setText(shortCutString());
    row.append(itemAbbreviation);
    row.append(itemDescription);
    row.append(itemShortCut);

    return row;
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void SystemKeyBoard::read(const QJsonObject &json){
    SystemLang::read(json);

    m_abbreviation = json["abr"].toString();

    QJsonArray jsonShort = json["sc"].toArray();
    for (int i = 0; i < jsonShort.size(); i++){
        QJsonArray tab = jsonShort.at(i).toArray();
        QVector<int> list;
        for (int j = 0; j < tab.size(); j++){
            list.append(tab.at(j).toInt());
        }
        m_shortcuts.append(list);
    }
}

// -------------------------------------------------------

void SystemKeyBoard::write(QJsonObject &json) const{
    SystemLang::write(json);
    json["abr"] = m_abbreviation;

    QJsonArray jsonShort;
    for (int i = 0; i < m_shortcuts.size(); i++){
        QJsonArray tab;
        QVector<int> l = m_shortcuts.at(i);
        for (int j = 0; j < l.size(); j++){
            tab.append(l.at(j));
        }
        jsonShort.append(tab);
    }
    json["sc"] = jsonShort;
}
