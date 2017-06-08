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

#include "systemkeyboard.h"

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

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void SystemKeyBoard::appendShortCut(QVector<int> v){
    m_shortcuts.append(v);
}

// -------------------------------------------------------

bool SystemKeyBoard::openDialog(){
    /*
    SystemKeyBoard key;
    key.setCopy(*this);
    DialogSystemClassSkill dialog(skill);
    if (dialog.exec() == QDialog::Accepted){
        setCopy(skill);
        return true;
    }
    */
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
}

// -------------------------------------------------------

QList<QStandardItem *> SystemKeyBoard::getModelRow() const{
    QList<QStandardItem*> row = QList<QStandardItem*>();
    QStandardItem* item = new QStandardItem;
    item->setText(toString());
    row.append(item);
    /*
    QStandardItem* itemSkill = new QStandardItem;
    QStandardItem* itemLevel = new QStandardItem;
    itemSkill->setData(QVariant::fromValue(reinterpret_cast<quintptr>(this)));
    itemSkill->setText(toString());
    itemLevel->setData(QVariant::fromValue(level()));
    itemLevel->setText(QString::number(level()));
    row.append(itemSkill);
    row.append(itemLevel);
    */

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
