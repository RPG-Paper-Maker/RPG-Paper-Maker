/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#ifndef SYSTEMKEYBOARD_H
#define SYSTEMKEYBOARD_H

#include "systemlang.h"

// -------------------------------------------------------
//
//  CLASS SystemKeyBoard
//
//  A particulary key (keyboard).
//
// -------------------------------------------------------

class SystemKeyBoard : public SystemLang
{
public:
    SystemKeyBoard();
    SystemKeyBoard(int i, LangsTranslation *names, QString abreviation);
    SystemKeyBoard(int i, LangsTranslation *names, QString abreviation,
                   QVector<QVector<int>> shortcut);
    virtual ~SystemKeyBoard();
    QString abbreviation() const;
    void setAbbreviation(QString s);
    void appendShortCut(QVector<int> v);
    void updateLastShortCut(QVector<int> v);
    QString shortCutString() const;
    bool isEqual(int key) const;
    void removeLast();
    void removeAll();
    virtual QString toString() const;
    virtual bool openDialog();
    virtual SuperListItem* createCopy() const;
    virtual void setCopy(const SystemKeyBoard &k);
    virtual QList<QStandardItem*> getModelRow() const;

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    QString m_abbreviation;
    QVector<QVector<int>> m_shortcuts;

};

Q_DECLARE_METATYPE(SystemKeyBoard)

#endif // SYSTEMKEYBOARD_H
