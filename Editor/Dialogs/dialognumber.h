/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGNUMBER_H
#define DIALOGNUMBER_H

#include <QDialog>
#include <QStandardItemModel>
#include "primitivevalue.h"

namespace Ui {
class DialogNumber;
}

class DialogNumber : public QDialog
{
    Q_OBJECT

public:
    explicit DialogNumber(PrimitiveValue *value, QString title, QString label =
        QString(), QWidget *parent = nullptr);
    ~DialogNumber();

    void initialize();
    void translate();

private:
    Ui::DialogNumber *ui;
    QString m_title;
    QString m_label;
    PrimitiveValue *m_value;
};

#endif // DIALOGNUMBER_H
