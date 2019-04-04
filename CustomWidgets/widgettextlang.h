/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
