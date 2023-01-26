/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGSETMAXIMUM_H
#define DIALOGSETMAXIMUM_H

#include <QDialog>
#include <QStandardItemModel>

// -------------------------------------------------------
//
//  CLASS DialogSetMaximum
//
//  A dialog used for setting the maximum number of items in
//  a super list.
//
// -------------------------------------------------------

namespace Ui {
class DialogSetMaximum;
}

class DialogSetMaximum : public QDialog
{
    Q_OBJECT

public:
    explicit DialogSetMaximum(QStandardItemModel* model, int max,
                              QWidget *parent = nullptr);
    ~DialogSetMaximum();
    int maximum() const;

    static bool isOrderedMax(QStandardItemModel* model, int limit);

private:
    Ui::DialogSetMaximum *ui;
    QStandardItemModel* m_model;

    bool isOrdered(int limit) const;
    void translate();

private slots:
    void accept();
};

#endif // DIALOGSETMAXIMUM_H
