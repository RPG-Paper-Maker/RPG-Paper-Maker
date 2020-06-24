/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef WIDGETTEXTLANG_H
#define WIDGETTEXTLANG_H

#include <QLineEdit>
#include "systemlang.h"

// -------------------------------------------------------
//
//  CLASS WidgetTextLang
//
//  A widget used for entering text according to languages.
//
// -------------------------------------------------------

namespace Ui {
class WidgetTextLang;
}

class WidgetTextLang : public QWidget
{
    Q_OBJECT

public:
    explicit WidgetTextLang(QWidget *parent = nullptr);
    ~WidgetTextLang();
    QLineEdit* lineEdit() const;
    void initializeNamesTrans(LangsTranslation *l);
    void initializeNamesLang(SystemLang *lang);

private:
    Ui::WidgetTextLang *ui;
    LangsTranslation *m_l;
    SystemLang *m_lang;

    void initializeNames();

private slots:
    void on_lineEdit_textChanged(const QString &text);

signals:
    void mainChanged(const QString &name);
};

#endif // WIDGETTEXTLANG_H
